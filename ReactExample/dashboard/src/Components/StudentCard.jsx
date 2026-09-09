import React,{useState} from 'react'

// const StudentCard = (props) => {
//   return (
//     <div className="card">
//       <h2>{props.name}</h2>
//       <p>Course : {props.course}</p>
//       <h3>Like : 2</h3>
//       <button>LIKE</button>
//     </div>
//   )
// }
const StudentCard = ({name,course}) => {

const [likes,setLikes]= useState(0)

function increaseLike(){
  setLikes(likes +1)
}

  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Course : {course}</p>
      <h3>Like :{likes}</h3>
      <button onClick={increaseLike}>LIKE</button>
    </div>
  )
}

export default StudentCard
