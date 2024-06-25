import React from 'react'

const ViewDetails = ({heading , value}) => {
  return (
    <div
        className=""
        style={{ width: "100%", display: "flex" }}
        >
        <h4
            style={{
            marginTop: "15px",
            marginBottom: "10px",
            width: "40%",
            }}
        >
            {heading}
        </h4>
        <p style={{ marginTop: "15px", marginBottom: "10px" }}>
            {value}
        </p>
    </div>
  )
}

export default ViewDetails