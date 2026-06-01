require('dotenv').config();
const Redis = require('ioredis');

const sub = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null
});

let totalRecibidos = 0;

sub.on('ready', () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   StudySync — Suscriptor Redis Pub/Sub   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('✅ Conectado a Upstash Redis');
  console.log('👂 Escuchando canales study:*...');
  console.log('');

  sub.psubscribe('study:*', (err, count) => {
    if (err) {
      console.error('❌ Error al suscribirse:', err.message);
    } else {
      console.log(`📡 Suscrito a ${count} patrón(es)`);
      console.log('   Canales escuchados:');
      console.log('   → study:grupo:creado');
      console.log('   → study:grupo:actualizado');
      console.log('   → study:grupo:eliminado');
      console.log('   → study:sesion:creada');
      console.log('   → study:usuario:unido');
      console.log('   → study:material:publicado');
      console.log('════════════════════════════════════════');
      console.log('   Esperando mensajes...');
      console.log('════════════════════════════════════════');
      console.log('');
    }
  });
});

sub.on('error', (err) => {
  if (!err.message.includes('subscriber mode')) {
    console.error('❌ Error:', err.message);
  }
});

sub.on('pmessage', (patron, canal, mensajeRaw) => {
  try {
    const mensaje = JSON.parse(mensajeRaw);
    totalRecibidos++;
    const hora = new Date(mensaje.timestamp).toLocaleTimeString('es-BO');

    console.log(`┌─ Mensaje #${totalRecibidos} ──────────────────────────`);
    console.log(`│  Hora:    ${hora}`);
    console.log(`│  Canal:   ${canal}`);
    console.log(`│  Tipo:    ${mensaje.tipo}`);
    console.log('│');

    switch (mensaje.tipo) {

      case 'GRUPO_CREADO':
        const gc = mensaje.payload;
        console.log(`│  ✅ Nuevo grupo creado en Supabase`);
        console.log(`│     ID:      ${gc.id}`);
        console.log(`│     Nombre:  ${gc.nombre}`);
        console.log(`│     Materia: ${gc.materia}`);
        console.log(`│     Turno:   ${gc.turno}`);
        console.log(`│  📧 Notificando a estudiantes...`);
        break;

      case 'GRUPO_ACTUALIZADO':
        const gu = mensaje.payload;
        console.log(`│  ✏️  Grupo actualizado en Supabase`);
        console.log(`│     ID:      ${gu.id}`);
        console.log(`│     Nombre:  ${gu.nombre}`);
        console.log(`│  📧 Notificando cambios a miembros...`);
        break;

      case 'GRUPO_ELIMINADO':
        const ge = mensaje.payload;
        console.log(`│  🗑️  Grupo eliminado de Supabase`);
        console.log(`│     ID:     ${ge.id}`);
        console.log(`│     Nombre: ${ge.nombre}`);
        console.log(`│  📧 Notificando a miembros afectados...`);
        break;

      case 'SESION_CREADA':
        const s = mensaje.payload;
        console.log(`│  📚 Nueva sesión de estudio`);
        console.log(`│     Tema:  ${s.tema}`);
        console.log(`│     Fecha: ${s.fecha} | Lugar: ${s.lugar}`);
        console.log(`│  📧 Notificando a miembros del grupo...`);
        break;

      case 'USUARIO_UNIDO':
        const u = mensaje.payload;
        console.log(`│  🙋 ${u.nombre} se unió a ${u.nombreGrupo}`);
        console.log(`│  📧 Notificando al organizador...`);
        break;

      case 'MATERIAL_PUBLICADO':
        const m = mensaje.payload;
        console.log(`│  📄 Nuevo material: "${m.titulo}"`);
        console.log(`│     Materia: ${m.materia}`);
        console.log(`│  📧 Notificando a suscriptores...`);
        break;

      default:
        console.log(`│  ⚠️  Tipo desconocido: ${mensaje.tipo}`);
    }

    console.log('└────────────────────────────────────────');
    console.log('');
  } catch (err) {
    console.error('❌ Error al parsear:', err.message);
  }
});

process.on('SIGINT', () => {
  console.log(`\n📊 Total recibidos: ${totalRecibidos}`);
  console.log('👋 Suscriptor detenido.');
  sub.disconnect();
  process.exit(0);
});