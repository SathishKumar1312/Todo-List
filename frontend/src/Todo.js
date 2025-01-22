import React, { useState,useEffect } from "react";

function Todo() {
  const [title,setTitle] = useState('');
  const [description,setDesc] = useState('');
  const [todo,setTodo] = useState([]);
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');
  const [editId,setEditId] = useState(-1);
  const [editTitle,setEditTitle] = useState('');
  const [editDesc,setEditDesc] = useState('');
  const apiurl = 'http://localhost:5000/';

  useEffect(() => {
    getTodo();
  }, []);

  const handleSubmit = (e)=>{
    if(title.trim() !== '' && description.trim() !== ''){
      addTodo();
    }
  }

  const getTodo = async () => {
    try {
      const res = await fetch(apiurl + 'todos');
      const data = await res.json();
      setTodo(data);
    } catch (e) {
      console.log(e);
    }
  };

  async function addTodo(){
    setError('')
    try{
      await fetch(apiurl+'todos',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({title,description})
      })
      setTitle('');
      setDesc('');
      setTodo([...todo,{title,description}]);
      setMessage('Item added Successfully!')
      setTimeout(()=>setMessage(''),3000)
    } catch(e){
      setError('Cannot create Item!')
    }
  }

 function handleEdit(data) {
    setEditId(data._id);
    setEditTitle(data.title);
    setEditDesc(data.description)
    console.log(editId,editTitle,editDesc)
  }

  async function updateTodo(id){
      await fetch(apiurl+`todos/${id}`,{
        method:'PUT',
        headers:{
          'Content-Type':"application/json"
        },
        body : JSON.stringify({title:editTitle,description:editDesc})
      })
      setEditId(-1)
      getTodo()
  }

  async function deleteTodo(id){
      await fetch(apiurl+`todos/${id}`,{
        method:'DELETE'
      })
      getTodo()
  }

  return (
    <div className="col-12 col-md-8 gx-0 mx-auto bg-light">
        <div className="row gx-0 bg-success text-light p-2 text-center">
            <h1>Todo List</h1>
        </div>

        <div className="row gx-0 p-2">
          <h3>Add Item</h3>
          {message && <p className="text-success">{message}</p>}
          <div className="form-group d-flex gap-2 my-2">
              <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="form-control"/>
              <input type="text" placeholder="Description" value={description} onChange={(e)=>setDesc(e.target.value)} className="form-control"/>
              <button type="submit" onClick={(e)=>handleSubmit(e)} className="btn btn-primary">Submit</button>
          </div>
          {error && <p className="text-danger">{error}</p>}
        </div>

        <div className="row gx-0 p-2">
          <h3>Tasks</h3>
          <ul className="list-group my-2">
          {todo && todo.map((data, i) => (
            <li key={i} className=" bg-info list-group-item d-flex justify-content-between align-items-center">
              {
              editId === data._id ?
                <>
                  <div className="d-flex gap-2 col">
                    <input type="text" placeholder="Title" value={editTitle} onChange={(e)=>setEditTitle(e.target.value)} className="form-control"/>
                    <input type="text" placeholder="Description" value={editDesc} onChange={(e)=>setEditDesc(e.target.value)} className="form-control"/>
                  </div>
                  <div className="d-flex gap-2 ms-2">
                    <button className="btn btn-sm btn-primary" onClick={() => updateTodo(data._id)}>Update</button>
                    <button className="btn btn-sm btn-danger" onClick={() => setEditId(-1)}>Cancel</button>
                  </div>
                </> : <>
                  <div className="d-flex flex-column">
                    <span className="fw-bold">{data.title}</span>
                    <span>{data.description}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-warning" onClick={()=>handleEdit(data)}>Edit</button>
                    <button className="btn btn-sm btn-danger" data-bs-target={`#modalDelete${i}`} data-bs-toggle="modal">Delete</button>
                    <div className="modal fade" data-bs-backdrop="static" id={`modalDelete${i}`} tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark">
                          <div className="modal-body">
                            <p className="text-white">Are you sure you want to delete?</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">NO</button>
                            <button type="button" className="btn btn-danger" onClick={()=>deleteTodo(data._id)} data-bs-dismiss="modal">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
          </li>
          ))}
          </ul>
        </div>

    </div>
  );
}

export default Todo;
