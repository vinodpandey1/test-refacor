// CONVERT TO UPPER CASE AND REPLACE SPACE WITH UNDERSCORE
export const convertToUpperCase = (data: string[]): string[] => {
    return data.map((element: string) => {
      const uppercaseElement: string = element.toUpperCase();
      const replacedElement: string = uppercaseElement.replace(/[-\s]/g, '_');
      return replacedElement;
    });
  };

// CONVERT TO LOWER CASE AND REPLACE UNDERSCORE WITH SPACE
  export const convertToLowerCase = (data: string[]): string[] => {
    return data.map((element: string) => {
      const lowercaseElement: string = element.toLowerCase();
      const words: string[] = lowercaseElement.split('_');
      const capitalizedWords: string[] = words.map((word) => {
        const firstLetter: string = word.charAt(0).toUpperCase();
        const restOfWord: string = word.slice(1);
        return firstLetter + restOfWord;
      });
      const replacedElement: string = capitalizedWords.join(' ');
      return replacedElement;
    });
  };

  // Remove keys from Object

  export function removeKeysFromObject(obj: any, keysToRemove: string[]): any {
    const { [keysToRemove[0]]: _, [keysToRemove[1]]: __, [keysToRemove[2]]: ___, ...rest } = obj;
    return rest;
  }
  
  
  