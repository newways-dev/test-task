import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components'
import { CreateTodo, Home, UpdateTodo } from './pages'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/create-todo' element={<CreateTodo />} />
        <Route path='/update-todo/:id' element={<UpdateTodo />} />
      </Routes>
    </Router>
  )
}

export default App
