export default function setTemporaryItemState(setItemInUse, setState) {
    setItemInUse(true);
    setState(true);
  
    return new Promise(resolve => {
      setTimeout(() => {
        setItemInUse(false);
        setState(false);
        resolve();
      }, 10000);
    });
  }