import React, { useState, useEffect } from 'react';
import { IoMdAdd } from "react-icons/io";
import { MdOutlineSaveAlt } from "react-icons/md";
import axios from 'axios';

const Crud = () => {
    const [item, setItem] = useState("");
    
    const [list, setList] = useState([]);
    const [mode, setMode] = useState(true);
    const [editIndex, setEditIndex] = useState(null);

    
    useEffect(() => {
        axios.get('http://localhost:8000/api/items')
            .then((response) => {
                setList(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the items!", error);
            });
    }, []);

    function addOrUpdate() {
        if (mode) {
            if (item.trim() !== "") {
                
                axios.post('http://localhost:8000/api/items', { name: item })
                    .then((response) => {
                        setList([...list, response.data.item]);
                        setItem("");
                    })
                    .catch((error) => {
                        console.error("There was an error adding the item!", error);
                    });
            }
        } else {
            
            axios.put(`http://localhost:8000/api/items/${list[editIndex]._id}`, { name: item, description: item, quantity: 1 })
                .then((response) => {
                    const updatedList = [...list];
                    updatedList[editIndex] = response.data.item;
                    setList(updatedList);
                    setMode(true);
                    setItem("");
                    setEditIndex(null);
                })
                .catch((error) => {
                    console.error("There was an error updating the item!", error);
                });
        }
    }

    function updateItem(index) {
        setMode(false);
        setItem(list[index].name);
        setEditIndex(index);
    }

    function deleteItem(index) {
        axios.delete(`http://localhost:8000/api/items/${list[index]._id}`)
            .then(() => {
                setList(list.filter((_, i) => i !== index));
            })
            .catch((error) => {
                console.error("There was an error deleting the item!", error);
            });
    }

    return (
        <div className="flex justify-center min-h-screen bg-gray-100 p-5">
            <div className="w-[80%] p-5 bg-white shadow-lg rounded-lg">
                <div className="text-center font-bold text-gray-800 text-3xl p-5">TODO APP</div>

                <div className="flex p-2 items-center mb-4">
                    <input
                        type="text"
                        placeholder="Enter Item Name"
                        value={item}
                        className="border border-gray-300 rounded-lg p-2 flex-1"
                        onChange={(e) => setItem(e.target.value)}
                    />
                    <button
                        className={mode?"bg-blue-500 text-white p-2 rounded-full ml-3 hover:bg-blue-600":"bg-yellow-500 text-white p-2 rounded-full ml-3 hover:bg-yellow-600"}
                        onClick={addOrUpdate}
                    >
                        {mode ? <IoMdAdd size={20} /> : <MdOutlineSaveAlt size={20} />}
                    </button>
                </div>

                <div>
                    <ul>
                        {list.map((x, index) => (
                            <div className="p-2" key={x._id}>
                                <li className="flex justify-between items-center bg-gray-200 p-3 mb-2 rounded-lg shadow-md hover:bg-gray-300">
                                    <span>{x.name}</span>
                                    <div>
                                        <button
                                            className="bg-green-400 text-white w-20 p-2 rounded-lg ml-2 hover:bg-green-500"
                                            onClick={() => updateItem(index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white p-2 w-20 rounded-lg ml-2 hover:bg-red-600"
                                            onClick={() => deleteItem(index)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Crud;
