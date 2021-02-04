import React, { useState, useEffect } from "react"

const linkStyle = {
  color: "#999",
  textDecorationStyle: "dotted",
}

const App = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetch("/api/data/", {
           headers:{
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        method: "GET",
        credentials: "same-origin",
      })
      const read = await fetchedData.json()
      setData(read.data)
      console.log(read)
    }
    getData()
  }, [])

  return (
    <main
      style={{
        width: "100vw",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#222",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      {data.length
        ? data.map((teamData, i) => (
            <div
              key={i}
              style={{
                width: "50%",
                margin: ".5em 0",
                display: "flex",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
                fontSize: "min(4vw,1.5em)",
                color: "#6f6f6f",
                justifyContent: "space-around",
              }}
            >
              <img
                src={teamData.image}
                alt={teamData.fullName}
                style={{ height: "10em", borderRadius: "50%" }}
              />
              <div
                style={{
                  minWidth: "12em",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <span>Name: {teamData.fullName}</span>
                <span>Title: {teamData.title}</span>
                <a
                  href={`mailto:${teamData.email}?subject=Hi ${teamData.firstName}!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Contact {teamData.firstName}
                </a>
                <a
                  href={`https://twitter.com/${teamData.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  {teamData.firstName}'s twitter
                </a>
              </div>
            </div>
          ))
        : null}
    </main>
  )
}

export default App