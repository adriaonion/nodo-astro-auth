import { useEffect, useRef } from 'react';
export default function Dialog({title,children,onClose}) {
  const ref=useRef(null);
  useEffect(()=>{const dialog=ref.current;dialog.showModal();const close=()=>onClose();dialog.addEventListener('close',close);return()=>{dialog.removeEventListener('close',close);dialog.close();};},[]);
  return <dialog ref={ref} aria-labelledby="dialog-title"><div className="dialog-head"><h2 id="dialog-title">{title}</h2><button className="icon-button" onClick={onClose} aria-label="Cerrar ventana">×</button></div>{children}</dialog>;
}
