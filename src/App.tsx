import React, { useEffect, useState, useRef } from 'react';
import Login from './pages/Login/Login';

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

const CDNURL =
  'https://iwdgvmisbscppludogev.supabase.co/storage/v1/object/public/docs/';

const DOCUMENT_TYPES = {
  'application/pdf': require('./assets/pdf-thumb.png'),
  'application/doc': require('./assets/doc-thumb.png'),
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': require('./assets/doc-thumb.png')
} as any;

interface LoginParmas {
  email: string;
  password: string;
}

function App() {
  const [docs, setDocs] = useState([]);

  const [file, setFile] = useState<any>(null);
  const user = useUser();
  const supabase = useSupabaseClient();
  console.log('user', user);

  const inputFile = useRef<any>(null);

  useEffect(() => {
    if (user) {
      getdocs();
    }
  }, [user]);

  async function getdocs() {
    const { data, error }: any = await supabase.storage
      .from('docs')
      .list(user?.id + '/', {
        limit: 100,
        offset: 0,
        sortBy: {
          column: 'name',
          order: 'asc'
        }
      });

    if (data !== null) {
      setDocs(data);
    } else {
      alert('Error loading');
      console.log(error);
    }
  }

  const loginHandler = (params: LoginParmas) => {
    console.log('0-=---', params);

    const { data, error }: any = supabase.auth.signInWithPassword({
      email: params.email,
      password: params.password
    });
    if (error) {
      alert('Invalid Email and Password');
      console.log(error);
    } else {
      console.log('Login', data);
    }
  };

  console.log('user is', user);

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  async function uploadDoc(e: any) {
    console.log('--------------------e', e);
    let selectedFile = e.target.files[0];
    console.log('file is', selectedFile);
    setFile(selectedFile);
  }

  async function uploadFile() {
    if (file) {
      const { data, error } = await supabase.storage
        .from('docs')
        .upload(user?.id + '/' + uuidv4(), file);
      inputFile.current.value = '';
      inputFile.current.type = 'file';
      setFile(null);
      if (data) {
        getdocs();
      } else {
        console.log('error', error);
      }
    }
  }

  async function deleteDoc(imgName: string) {
    const { error } = await supabase.storage
      .from('docs')
      .remove([user?.id + '/' + imgName]);
    if (error) {
      alert(error);
    } else {
      getdocs();
    }
  }

  async function openDoc(url: any) {
    window.open(url, '_blank', 'noreferrer');
  }

  console.log('docs is', docs);

  return (
    <Container>
      {user === null ? (
        <Login onLogin={loginHandler} />
      ) : (
        <>
          <h1>Your Docs</h1>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <p>Current user: {user.email}</p>
          <p>Use the Choose File button below to upload a document</p>
          <div>
            <Form.Group className="mt-3" style={{ maxWidth: '500px' }}>
              <Form.Control
                ref={inputFile}
                type="file"
                onChange={(e) => uploadDoc(e)}
              />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={uploadFile}>
              Upload
            </Button>
          </div>
          <hr />
          <h3>Your Docs</h3>
          <Row xs={1} md={3} className="g-4">
            {docs.map((doc: any) => {
              const fileType = DOCUMENT_TYPES[doc.metadata.mimetype];
              const url = CDNURL + user.id + '/' + doc.name;
              return (
                <Col key={CDNURL + user.id + '/' + doc.name}>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={fileType || url}
                      style={{ height: '200px', width: '200px' }}
                    />
                    <Card.Body className="d-flex flex-row justify-content-between">
                      <Button variant="primary" onClick={() => openDoc(url)}>
                        View
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteDoc(doc.name)}
                      >
                        Delete
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;
