import { useState } from 'react';
import { request, setToken } from '../lib/api';
export default function AuthForm({onSuccess}) {
  const [register,setRegister]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState('');
  async function submit(event) {
    event.preventDefault();setPending(true);setError('');
    const values=Object.fromEntries(new FormData(event.currentTarget));
    const input={email:values.email.trim().toLowerCase(),password:values.password,...(register?{name:values.name.trim()}:{})};
    if(new TextEncoder().encode(input.password).length>72){setError('La contraseña admite hasta 72 bytes.');setPending(false);return;}
    try {
      const operation=register?'register':'login',type=register?'RegisterInput':'LoginInput';
      const data=await request(`mutation($input:${type}!) { ${operation}(input:$input) { accessToken user {id name email role} } }`,{input});
      setToken(data[operation].accessToken);onSuccess(data[operation].user);
    } catch(e){setError(e.message);}finally{setPending(false);}
  }
  return <div className="auth-grid"><section className="auth-copy"><p className="eyebrow">TU ESPACIO EN NODO</p><h1>Todo listo.<br/>A tu manera.</h1><p>Guarda tus pedidos y arma tu próximo escritorio.</p><div className="auth-note">Proyecto académico · Los pedidos son de demostración. No se realizan cobros.</div></section><section className="auth-panel"><div className="switcher"><button className={!register?'selected':''} onClick={()=>{setRegister(false);setError('')}}>Iniciar sesión</button><button className={register?'selected':''} onClick={()=>{setRegister(true);setError('')}}>Crear cuenta</button></div><h2>{register?'Un nuevo comienzo':'Qué bueno verte'}</h2><p className="muted">{register?'Crea tu cuenta de cliente.':'Ingresa con tu correo y contraseña.'}</p><form onSubmit={submit} key={String(register)}>{register&&<label>Nombre<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>}<label>Correo electrónico<input name="email" type="email" required maxLength={254} autoComplete="email" /></label><label>Contraseña<input name="password" type="password" required minLength={10} maxLength={72} autoComplete={register?'new-password':'current-password'} /></label>{register&&<small>Usa al menos 10 caracteres. Tu cuenta tendrá el rol cliente.</small>}{error&&<p role="alert" className="error">{error}</p>}<button className="primary wide" disabled={pending}>{pending?'Procesando…':register?'Crear mi cuenta':'Entrar'}</button></form><p className="session-note">La sesión dura hasta 30 minutos y se mantiene solo en esta pestaña. Al recargar, vuelve a iniciar sesión.</p></section></div>;
}
