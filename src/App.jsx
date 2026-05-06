import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

function App() {
  const [videos, setVideos] = useState([]); 
  const [cancionesBar, setCancionesBar] = useState([]); 
  const [conteo, setConteo] = useState(0);
  const [loading, setLoading] = useState(false);

  // URLs de tu API
  const URL_API_BAR = "https://lanell-unbreaking-leigh.ngrok-free.dev/api_rockola.php";
  const URL_ACTUALIZAR_YT = "https://lanell-unbreaking-leigh.ngrok-free.dev/actualizar_youtube.php";

  // Función para obtener la lista de MySQL
  const cargarMusicaDelBar = async () => {
    try {
      const res = await axios.get(URL_API_BAR, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      setCancionesBar(res.data);
    } catch (err) {
      console.error("Error al leer la base de datos del bar:", err);
    }
  };

  // --- NUEVA FUNCIÓN: SINCRONIZA Y RECARGA ---
  const refrescarTodo = async () => {
    setLoading(true);
    try {
      // 1. Ejecuta el script PHP que usa tu API KEY de YouTube
      await axios.get(URL_ACTUALIZAR_YT, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });

      // 2. Una vez que el PHP terminó de insertar, cargamos la lista nueva
      await cargarMusicaDelBar();
      
      console.log("Sincronización completa");
    } catch (err) {
      console.error("Error al sincronizar con YouTube:", err);
      alert("Error al conectar con el servidor de actualización");
    } finally {
      setLoading(false);
    }
  };

  const marcarComoDescargado = async (id) => {
    try {
      await axios.delete(`${URL_API_BAR}?id=${id}`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      cargarMusicaDelBar(); 
    } catch (err) {
      console.error("Error al limpiar canción:", err);
    }
  };

  useEffect(() => {
    cargarMusicaDelBar();
    const intervalo = setInterval(() => {
      cargarMusicaDelBar();
    }, 10000); 
    return () => clearInterval(intervalo);
  }, []);

  const handleLogout = () => {
    googleLogout();
    setVideos([]);
    setConteo(0);
  };

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await axios.get(
          'https://www.googleapis.com/youtube/v3/playlistItems',
          {
            params: { part: 'snippet,contentDetails', playlistId: 'LL', maxResults: 50 },
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        if (res.data.items) setVideos(res.data.items);
      } catch (err) {
        console.error("Error en YouTube:", err);
      } finally {
        setLoading(false);
      }
    },
    scope: "https://www.googleapis.com/auth/youtube.force-ssl",
  });

  const downloadMusic = async (id, titulo) => {
    try {
      await axios.get(`${URL_API_BAR}?download_id=${id}`, {
        headers: { "ngrok-skip-browser-warning": "69420" }
      });
      alert(`Iniciando descarga de: ${titulo}`);
      setConteo(prev => prev + 1);
    } catch (err) {
      console.error("Error al descargar:", err);
    }
  };

  // ESTILOS DE BOTONES REUTILIZABLES
  const btnRedStyle = {
    flex: 2,
    backgroundColor: '#ff0000',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '30px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
  };

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', color: '#eee', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 40px', backgroundColor: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(15px)', borderBottom: '1px solid #222'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🎙️</span>
            <h2 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
              Monterrey<span style={{ color: '#ff0000' }}> Playlist</span>
            </h2>
          </div>
          <div style={{ border: '1px solid #1db954', color: '#1db954', padding: '4px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            📥 {conteo} Descargas
          </div>
        </div>
        {videos.length > 0 && (
          <button onClick={handleLogout} style={{ backgroundColor: 'transparent', color: '#aaa', border: '1px solid #444', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        )}
      </nav>

      <div style={{ padding: '40px' }}>
        
        <section style={{ marginBottom: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#ff0000', margin: 0 }}>🔥 Capturado en el Bar (Hoy)</h3>
            
            {/* BOTÓN ACTUALIZADO PARA LLAMAR A LA NUEVA FUNCIÓN */}
            <button 
              onClick={refrescarTodo} 
              disabled={loading}
              style={{ background: '#1a1a1a', color: '#888', border: '1px solid #333', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }}
            >
              {loading ? '⌛ Sincronizando...' : '🔄 Actualizar ahora'}
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {cancionesBar.length === 0 ? (
              <p style={{ color: '#444' }}>Esperando capturas automáticas...</p>
            ) : (
              cancionesBar.map((item) => (
                <div key={item.id} style={{ background: '#121212', padding: '20px', borderRadius: '15px', display: 'flex', flexDirection: 'column', gap: '15px', border: '1px solid #1a1a1a', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`} alt="thumb" style={{ borderRadius: '10px', width: '100px' }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0', color: '#fff' }}>{item.titulo}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => downloadMusic(item.id, item.titulo)} style={btnRedStyle}>
                      Descargar MP3
                    </button>
                    <button 
                      onClick={() => marcarComoDescargado(item.id)}
                      style={{ flex: 1, background: '#1a1a1a', color: '#888', border: '1px solid #333', padding: '10px', borderRadius: '30px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      ✓ Listo
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <hr style={{ border: '0', borderTop: '1px solid #1a1a1a', marginBottom: '40px' }} />

        {videos.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '5vh' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Tus Favoritos de YouTube</h1>
            <button onClick={() => login()} style={{ ...btnRedStyle, padding: '15px 50px', fontSize: '18px' }}>
              Conectar Cuenta Personal
            </button>
          </div>
        )}

        {loading && videos.length === 0 && <div style={{ textAlign: 'center' }}><p>Cargando favoritos...</p></div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '30px' }}>
          {videos.map((video) => {
            const vId = video.contentDetails?.videoId || video.id;
            return (
              <div key={vId} style={{ background: '#121212', borderRadius: '15px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
                <img src={video.snippet.thumbnails.medium?.url} style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} alt="miniatura" />
                <div style={{ padding: '20px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 15px 0', height: '40px', overflow: 'hidden' }}>{video.snippet.title}</p>
                  <button onClick={() => downloadMusic(vId, video.snippet.title)} style={{ ...btnRedStyle, width: '100%' }}>
                    Descargar MP3
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;