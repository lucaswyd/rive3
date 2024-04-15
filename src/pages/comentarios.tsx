import { useState, useEffect, useRef, FormEvent } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp, onSnapshot, query, orderBy, DocumentData } from 'firebase/firestore';
import { getAuth, User } from 'firebase/auth';
import styles from '../components/Comentarios/style.module.scss';

// Inicializa o Firebase com as variáveis de ambiente
initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASUREMENT_ID,
});

type Comment = {
  id: string;
  usuario: string;
  texto: string;
  data: Date;
};

export default function Comentarios() {
  const [comentarios, setComentarios] = useState<Comment[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const commentContainerRef = useRef<HTMLDivElement>(null); // Referência para o contêiner de comentários
  const enviarContainerRef = useRef<HTMLDivElement>(null); // Referência para o contêiner de envio de comentários

  useEffect(() => {
    console.log('Fetching comments...');
    const q = query(collection(db, 'comentarios'), orderBy('data', 'desc')); // Ordena os comentários pela data, em ordem decrescente
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comentariosData: Comment[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        usuario: doc.data().usuario,
        texto: doc.data().texto,
        data: doc.data().data.toDate(),
      }));
      console.log('Comments:', comentariosData);
      // Atualizar os comentários e rolar para o final do contêiner
      setComentarios(comentariosData);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [db]);

  const scrollToBottom = () => {
    if (commentContainerRef.current) {
      commentContainerRef.current.scrollTop = commentContainerRef.current.scrollHeight;
    }
  };

  const handleComentarioSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting comment...');
    const user: User | null = auth.currentUser;
    if (!user) {
      // Exibir popup ou notificação informando que é necessário fazer login ou registrar-se
      alert('Você precisa estar logado para enviar um comentário.');
      return;
    }
    if (novoComentario.trim() === '') {
      console.log('Comentário vazio.');
      return;
    }

    // Verificar se já passaram 4 horas desde o último comentário
    const ultimoComentario = comentarios[0];
    if (ultimoComentario && ultimoComentario.data) {
      const ultimaData = ultimoComentario.data;
      const diferencaEmHoras = (new Date().getTime() - ultimaData.getTime()) / (1000 * 60 * 60);
      if (diferencaEmHoras < 4) {
        alert('Você só pode enviar um comentário a cada 4 horas.');
        return;
      }
    }

    try {
      const userName = user.displayName || 'Anônimo';
      await addDoc(collection(db, 'comentarios'), {
        usuario: userName, // Adiciona o nome do usuário
        texto: novoComentario,
        data: Timestamp.fromDate(new Date()),
      });
      console.log('Comentário adicionado');
      setNovoComentario('');
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CHAT</h1>
      <div className={styles.commentContainer} style={{ maxHeight: '300px', overflowY: 'auto' }} ref={commentContainerRef}>
        {comentarios.map((comentario) => (
          <div key={comentario.id} className={styles.comment}>
            <p><strong>{comentario.usuario}: </strong>{comentario.texto}</p>
          </div>
        ))}
      </div>
      <div ref={enviarContainerRef} className={styles.enviarContainer}>
        <form onSubmit={handleComentarioSubmit} className={styles.form}>
          <textarea
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            placeholder="Uma mensagem a cada 4 horas, pense antes de enviar..."
            className={styles.textarea}
          />
          <button type="submit" className={styles.button}>Enviar</button>
        </form>
      </div>
    </div>
  );
}
