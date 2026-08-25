// js/history/import.js
export function importHistory(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) resolve(data);
        else reject();
      } catch (e) { reject(); }
    };
    reader.readAsText(file);
  });
}
