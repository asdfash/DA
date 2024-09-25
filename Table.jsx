import React, { useState, useEffect } from "react"
import axios from "axios"

function UsersTable() {
  const [posts, setPosts] = useState([])
  const [editPost, setEditPost] = useState(null)

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then(response => {
        console.log("Response Data: ", response.data)
        setPosts(response.data)
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error)
      })
  }, [])

  const handleEdit = post => {
    setEditPost({ ...post })
  }

  const handleSave = async updatedPost => {
    try {
      const response = await axios.put(`http://localhost:5000/update/${updatedPost.id}`, {
        password: updatedPost.password,
        email: updatedPost.email,
        is_active: updatedPost.is_active
      })

      setPosts(posts.map(post => (post.id === updatedPost.id ? updatedPost : post)))

      setEditPost(null)
    } catch (error) {
      console.error("There was an error updating the post!", error)
    }
  }

  const handleCancel = () => {
    setEditPost(null)
  }

  return (
    <div>
      <h1>TEST</h1>
      {posts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Password</th>
              <th>Email</th>
              <th>is_active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(item => (
              <tr key={item.id}>
                {editPost && editPost.id === item.id ? (
                  <>
                    <td key={item.username}>{item.username}</td>
                    <td key={item.password}>
                      <input type="password" value={editPost.password} onChange={e => setEditPost({ ...editPost, password: e.target.value })} />
                    </td>
                    <td key={item.email}>
                      <input type="email" value={editPost.email} onChange={e => setEditPost({ ...editPost, email: e.target.value })} />
                    </td>
                    <td key={item.is_active}>
                      <input
                        type="checkbox"
                        checked={editPost.is_active === 1} // Check if is_active is 1
                        onChange={e => setEditPost({ ...editPost, is_active: e.target.checked ? 1 : 0 })} // Update based on checkbox state
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSave(editPost)}>Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{item.username}</td>
                    <td>******</td>
                    <td>{item.email}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.is_active === 1} // Check if is_active is 1
                        disabled // Disable the checkbox in read-only mode
                      />
                    </td>
                    <td>
                      <button onClick={() => handleEdit(item)}>Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  )
}

export default UsersTable
