import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'react-syntax-highlighter/dist/esm/styles/prism/solarizedlight';
import language from 'react-syntax-highlighter/dist/esm/languages/hljs/1c';
import './App.css';


const App = () => {
  const [pastes, setPastes] = useState([]);
  const [newPasteContent, setNewPasteContent] = useState('');
  const [lang,setLang] = useState("javascript");
  const [editingPasteId, setEditingPasteId] = useState(null);
  const [updatedPasteContent, setUpdatedPasteContent] = useState('');


  const options = [

   { label: 'cpp', value: 'cpp' },

   { label: 'javascript', value: 'javascript' },

   { label: 'python', value: 'python' },

 ];

const handleChange = (event) => {

   setLang(event.target.value);

 };

  useEffect(() => {
    // Fetch pastes when the component mounts
    fetchPastes();
  }, []);

  const fetchPastes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pastes'); 
      setPastes(response.data);
    } catch (error) {
      console.error('Error fetching pastes:', error);
    }
  };

  const createPaste = async () => {
    try {
      await axios.post('http://localhost:5000/api/pastes', { content: newPasteContent, language:language, slug:null }); 
      // Refresh the paste list
      fetchPastes();
      // Clear the input field
      setNewPasteContent('');
    } catch (error) {
      console.error('Error creating paste:', error);
    }
  };

  const updatePaste = async (id) => {
  try {
    await axios.put(`http://localhost:5000/api/pastes/${id}`, { content: updatedPasteContent, language:language, slug:null }); 
    // Reset editing state
    setEditingPasteId(null);
    setUpdatedPasteContent('');
    // Refresh the paste list
    fetchPastes();
  } catch (error) {
    console.error('Error updating paste:', error);
  }
};


  const deletePaste = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/pastes/${id}`); 
      // Refresh the paste list
      fetchPastes();
    } catch (error) {
      console.error('Error deleting paste:', error);
    }
  };


  return (
    <div>
      <h1>Pastebin Clone</h1>
      {editingPasteId === null && (
      <div>
        <h2>Create a New Paste</h2>
        <textarea
          rows="4"
          cols="50"
          value={newPasteContent}
          onChange={(e) => setNewPasteContent(e.target.value)}
        />

          <label>
        <select value={lang} onChange={handleChange}>

         {options.map((option) => (

           <option key={option.value} value={option.value}>{option.label}</option>

         ))}

       </select>
       </label>

        <button onClick={createPaste}>Create Paste</button>
      </div>
     )}
      <div>
        <h2>Paste List</h2>
        <ul>
          {pastes.map((paste) => (
            <li key={paste._id}>
        {editingPasteId === paste._id ? (
      <div>
        <textarea
          rows="4"
          cols="50"
          value={updatedPasteContent}
          onChange={(e) => setUpdatedPasteContent(e.target.value)}
        />
        <button onClick={() => updatePaste(paste._id)}>Update</button>
      </div>
    ):(
              <div>
                <SyntaxHighlighter language={paste.language} style={solarizedlight}>
               {paste.content}
               </SyntaxHighlighter>
              <a
                href={'http://localhost:5000/api/pastes/' + paste.slug}
                target="_blank"
                rel = "noreferrer"
               // onClick={(e) => handleLinkClick(e, paste.slug)}
              >
                View Paste
              </a>

              <button onClick={() => setEditingPasteId(paste._id)}>Edit</button>
              <button onClick={() => deletePaste(paste._id)}>Delete</button>
              </div>
            )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
