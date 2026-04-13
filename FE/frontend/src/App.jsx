import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("Đang kết nối backend...")

  // 👇 GỌI API TỪ SPRING BOOT
  useEffect(() => {
    fetch("http://localhost:8080/api/test")
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => {
        console.error(err)
        setMessage("Không kết nối được BE")
      })
  }, [])

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div>
          <h1>Test FE ↔ BE</h1>
          <h2 style={{ color: "green" }}>{message}</h2>
        </div>

        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <h2>OK chưa?</h2>
          <p>Nếu thấy "Backend OK" là thành công</p>
        </div>
      </section>
    </>
  )
}

export default App