interface FileStructure {
  [ip: string]: any[];
}

const cleanFileStructure = (structure: FileStructure): FileStructure => {
  for (const key in structure) {
    if (Array.isArray(structure[key])) {
      structure[key] = structure[key].filter((item) => item !== '');

      // Clean nested objects
      structure[key] = structure[key]
        .map((item) =>
          typeof item === 'object'
            ? cleanFileStructure(item as FileStructure)
            : item
        )
        .filter((item) =>
          typeof item === 'object'
            ? Object.keys(item as FileStructure).length > 0
            : true
        );

      if (structure[key].length === 0) {
        delete structure[key];
      }
    }
  }
  return structure;
};

export const transformData = (data: { fileUrl: string }[]): FileStructure => {
  const fileStructure: FileStructure = {};

  data.forEach((item) => {
    const url = item.fileUrl;

    if (typeof url !== 'string') {
      console.error('Invalid URL:', url);
      return;
    }

    const urlParts = url.split('/');
    const ipWithPort = urlParts[2];
    const ip = ipWithPort.split(':')[0];
    const pathParts = urlParts.slice(3);

    if (!fileStructure[ip]) {
      fileStructure[ip] = [];
    }

    let currentLevel = fileStructure[ip];

    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) {
        currentLevel.push(part);
      } else {
        let nextLevel = currentLevel.find(
          (item) => typeof item === 'object' && item[part]
        );
        if (!nextLevel) {
          nextLevel = { [part]: [] };
          currentLevel.push(nextLevel);
        }
        currentLevel = nextLevel[part];
      }
    });
  });

  return cleanFileStructure(fileStructure);
};
