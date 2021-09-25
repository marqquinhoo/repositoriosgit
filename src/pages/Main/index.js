import React, { useState, useCallback, useEffect } from 'react';
import {FaGithub,FaPlus, FaSpinner, FaTrash, FaArrowAltCircleRight} from 'react-icons/fa';
import {Container,Form,SubmitButton,List,DeleteButton} from './styles';
import {Link} from 'react-router-dom';
import api from '../../services/api';

export default function Main(){

    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    //DidMount
    useEffect(()=>{
        const repoStorage = localStorage.getItem('repos');
        if(repositorios){
            setRepositorios(JSON.parse(repoStorage));
        }
    },[])

    //DidUpadate
    useEffect(()=>{
        localStorage.setItem('repos', JSON.stringify(repositorios));
    },[repositorios]);

   const handleSubmit = useCallback((e) =>{
    e.preventDefault();

    async function submit(){
        setLoading(true);
        setAlert(null);
        try{

            if(newRepo === ''){
                setAlert(true);
                throw new Error('Voce precisa indicar um repositorio');
            }

            const response = await api.get(`repos/${newRepo}`);  
            
            //Valida duplicados
            const hasRepo = repositorios.find(repo => repo.name === newRepo);
            
            if(hasRepo){
                setAlert(true);
                throw new Error('Repositório duplicado!');
            }

            const data = {
                name : response.data.full_name,
            }

            setRepositorios([...repositorios, data]);
            setNewRepo(''); 
        }catch(error){
            setAlert(true);
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    submit();

    }, [newRepo, repositorios]);        

    function handleinputChange(e){
        setNewRepo(e.target.value);
        setAlert(null);
    }

    const handleDelete = useCallback((repo) =>{
        const find = repositorios.filter(r => r.name !== repo)
        setRepositorios(find);
    }, [repositorios]);

    

    return(
        <Container>
            
             <h1><FaGithub size={25}/> Meus repositórios Favoritos - GIT HUB</h1>

             <Form onSubmit={handleSubmit} error={alert}>
                <input 
                type="text" 
                placeholder="Adicionar Repositorios"
                value={newRepo}
                onChange={handleinputChange}
                />
                
                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14}/>
                    ) : (
                        <FaPlus color="#FFF" size={14}/>
                    )}                    
                </SubmitButton>
             </Form>

             <List>
                 {repositorios.map(repo =>(
                     <li key={repo.name}>
                         <span>
                             <DeleteButton onClick={()=> handleDelete(repo.name)} >
                                <FaTrash/>
                             </DeleteButton>
                         </span>
                         <span>{repo.name}</span>
                         <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaArrowAltCircleRight size="20"/>
                         </Link>
                     </li>
                 ))}
             </List>

        </Container>
    )
}