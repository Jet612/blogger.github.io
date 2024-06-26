import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faArrowLeft } from '@awesome.me/kit-a2ceb3a490/icons/classic/solid';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../utils/UserContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';
import '../styles/create.css';
import { Link } from 'react-router-dom';

const Create = () => {
  const navigate = useNavigate();
  const { authUser, isReady } = useUserContext();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isPending, setIsPending] = useState(false);

  const textareaRef = useRef(null);

  // Redirect to home page only if `authUser` is null
  useEffect(() => {
    if (isReady && !authUser) {
      navigate('/');
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = '150px'; // Reset height to auto initially
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to fit content
    }
  }, [authUser, navigate, body, isReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);

    await addDoc(collection(db, 'blogs'), {
      title: title,
      body: body,
      authorId: authUser.uid,
      timestamp: serverTimestamp()
    });

    setIsPending(false);
    navigate('/');
  };

  // If `authUser` is null, return null and let useEffect handle the redirect
  // If `authUser` is not null, the user is logged in, so proceed with rendering
  if (!authUser) {
    return null;
  }

  return (
    <>
    <Link to="/" className="text-decoration-none back-button">
      <FontAwesomeIcon icon={faArrowLeft} /> Back
    </Link>
    <div className="create">
      <h1>Add a New Blog</h1>
      <form onSubmit={handleSubmit} className="create-blog">
        <div className="section">
          <label>Blog title:</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="section">
          <label>Blog body (supports markdown):</label>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            ref={textareaRef}
          />
        </div>
        {!isPending && (
          <button type="submit">
            Publish Blog <FontAwesomeIcon icon={faUpload} />
          </button>
        )}
        {isPending && <button disabled>Publishing...</button>}
      </form>
    </div>
    </>
  );
};

export default Create;
