// import React, { useState, useEffect, useContext, useRef } from 'react'
// import { UserContext } from '../context/user.context'
// import { useLocation } from 'react-router-dom'
// import axios from '../config/axios'
// import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
// import Markdown from 'markdown-to-jsx'
// import hljs from 'highlight.js'
// import { getWebContainer } from '../config/webContainer'

// function parseCohereMessage(message) {
//     if (!message) return { text: '', fileTree: null }
//     let clean = message.replace(/```json/g, '').replace(/```/g, '').trim()
//     try {
//         const parsed = JSON.parse(clean)
//         return { text: parsed.text || clean, fileTree: parsed.fileTree || null }
//     } catch (err) {
//         return { text: clean, fileTree: null }
//     }
// }

// function SyntaxHighlightedCode({ children, className }) {
//     const ref = useRef(null)
//     useEffect(() => {
//         if (ref.current && className?.includes('lang-')) {
//             hljs.highlightElement(ref.current)
//         }
//     }, [children, className])
//     return <code ref={ref} className={className}>{children}</code>
// }

// function normalizeFileTree(rawTree = {}) {
//     const normalized = {}
//     Object.entries(rawTree).forEach(([fileName, value]) => {
//         if (value?.file?.contents !== undefined) {
//             normalized[fileName] = value
//         } else if (value?.contents !== undefined) {
//             normalized[fileName] = {
//                 file: {
//                     contents: value.contents
//                 }
//             }
//         }
//     })
//     return normalized
// }

// const Project = () => {
//     const location = useLocation()
//     const { user } = useContext(UserContext)
//     const messageBox = useRef(null)

//     const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
//     const [isModalOpen, setIsModalOpen] = useState(false)
//     const [selectedUserId, setSelectedUserId] = useState(new Set())
//     const [project, setProject] = useState(location.state.project)
//     const [message, setMessage] = useState('')
//     const [users, setUsers] = useState([])
//     const [messages, setMessages] = useState([])
//     const [fileTree, setFileTree] = useState({})
//     const [currentFile, setCurrentFile] = useState(null)
//     const [openFiles, setOpenFiles] = useState([])
//     const [iframeUrl, setIframeUrl] = useState(null)
//     const [runProcess, setRunProcess] = useState(null)
//     const webContainerRef = useRef(null)

//     const handleUserClick = (id) => {
//         setSelectedUserId(prev => {
//             const newSet = new Set(prev)
//             newSet.has(id) ? newSet.delete(id) : newSet.add(id)
//             return newSet
//         })
//     }

//     const addCollaborators = () => {
//         axios.put("/projects/add-user", {
//             projectId: project._id,
//             users: Array.from(selectedUserId)
//         }).then(() => setIsModalOpen(false))
//           .catch(console.log)
//     }

//     const send = () => {
//         sendMessage('project-message', { message, sender: user })
//         setMessages(prev => [...prev, { sender: user, message }])
//         setMessage("")
//     }

//     const WriteAiMessage = (message) => {
//         const msgObj = parseCohereMessage(message)
//         return (
//             <div className='overflow-auto bg-slate-950 text-white rounded-sm p-2'>
//                 <Markdown children={msgObj.text} options={{ overrides: { code: SyntaxHighlightedCode } }} />
//             </div>
//         )
//     }

//     useEffect(() => {
//         initializeSocket(project._id)

//         if (!webContainerRef.current) {
//             getWebContainer()
//                 .then(container => webContainerRef.current = container)
//                 .catch(console.error)
//         }

//         receiveMessage('project-message', async (data) => {
//             if (data.sender._id === 'ai') {
//                 const msg = parseCohereMessage(data.message)
//                 const container = webContainerRef.current
//                 if (msg.fileTree && container) {
//                     try {
//                         const normalizedTree = normalizeFileTree(msg.fileTree)
//                         await container.mount(normalizedTree)
//                         setFileTree(normalizedTree)
//                         saveFileTree(normalizedTree)
//                     } catch (err) {
//                         console.error(err)
//                     }
//                 }
//                 data.message = msg.text
//             }
//             setMessages(prev => [...prev, data])
//         })

//         axios.get(`/projects/get-project/${project._id}`)
//             .then(res => {
//                 const normalizedTree = normalizeFileTree(res.data.project.fileTree)
//                 setFileTree(normalizedTree)
//             })
//             .catch(console.log)

//         axios.get('/users/all')
//             .then(res => setUsers(res.data.users))
//             .catch(console.log)
//     }, [])

//     const saveFileTree = (ft) => {
//         axios.put('/projects/update-file-tree', { projectId: project._id, fileTree: ft })
//             .then(console.log)
//             .catch(console.log)
//     }

//     const downloadChatHistory = (messages) => {
//         const content = messages.map(msg => {
//             const sender = msg.sender.email || 'Unknown'
//             const text = msg.sender._id === 'ai' ? parseCohereMessage(msg.message)?.text : msg.message
//             return `${sender}:\n${text}\n\n`
//         }).join('')
//         const blob = new Blob([content], { type: 'text/plain' })
//         const url = URL.createObjectURL(blob)
//         const a = document.createElement('a')
//         a.href = url
//         a.download = 'chat-history.txt'
//         a.click()
//         URL.revokeObjectURL(url)
//     }

//     return (
//         <main className='h-screen w-screen flex'>
//             {/* Left Panel */}
//             <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
//                 <header className='flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0'>
//                     <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
//                         <i className="ri-add-fill mr-1"></i><p>Add collaborator</p>
//                     </button>
//                     <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2'>
//                         <i className="ri-group-fill"></i>
//                     </button>
//                 </header>
//                 <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
//                     <div ref={messageBox} className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide">
//                         {messages.map((msg, i) => (
//                             <div key={i} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id === user._id && 'ml-auto'} message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
//                                 <small className='opacity-65 text-xs'>{msg.sender.email}</small>
//                                 <div className='text-sm'>{msg.sender._id === 'ai' ? WriteAiMessage(msg.message) : <p>{msg.message}</p>}</div>
//                             </div>
//                         ))}
//                     </div>
//                     <div className="inputField w-full flex absolute bottom-0">
//                         <input value={message} onChange={(e) => setMessage(e.target.value)} className='p-2 px-4 border-none outline-none flex-grow' type="text" placeholder='Enter message' />
//                         <button onClick={send} className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
//                         <button onClick={() => downloadChatHistory(messages)} className='inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow hover:from-blue-700 hover:to-blue-600'>Download</button>
//                     </div>
//                 </div>
//             </section>

//             {/* Right Panel */}
//             <section className="right bg-red-50 flex-grow h-full flex">
//                 <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
//                     <div className="file-tree w-full">
//                         {Object.keys(fileTree).map((file, idx) => (
//                             <button key={idx} onClick={() => { setCurrentFile(file); setOpenFiles(prev => [...new Set([...prev, file])]) }} className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full">
//                                 <p className='font-semibold text-lg'>{file}</p>
//                             </button>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="code-editor flex flex-col flex-grow h-full shrink">
//                     <div className="top flex justify-between w-full">
//                         <div className="files flex">
//                             {openFiles.map((file, idx) => (
//                                 <button key={idx} onClick={() => setCurrentFile(file)} className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${currentFile === file ? 'bg-slate-400' : ''}`}>
//                                     <p className='font-semibold text-lg'>{file}</p>
//                                 </button>
//                             ))}
//                         </div>

//                         {/* Run button */}
//                         <div className="actions flex gap-2">
//                             <button
//                                 onClick={async () => {
//                                     const container = webContainerRef.current
//                                     if (!container) return console.error("WebContainer not ready")
//                                     try {
//                                         await container.mount(fileTree)

//                                         const installProcess = await container.spawn("npm", ["install"])
//                                         installProcess.output.pipeTo(new WritableStream({ write(chunk) { console.log(chunk) } }))

//                                         if (runProcess) runProcess.kill()

//                                         const tempRunProcess = await container.spawn("node", ["app.js"])
//                                         tempRunProcess.output.pipeTo(new WritableStream({ write(chunk) { console.log(chunk) } }))
//                                         setRunProcess(tempRunProcess)

//                                         container.on('server-ready', (port, url) => setIframeUrl(url))
//                                     } catch (err) {
//                                         console.error(err)
//                                     }
//                                 }}
//                                 className='p-2 px-4 bg-slate-700 text-white rounded'
//                             >
//                                 Run
//                             </button>
//                         </div>
//                     </div>

//                     <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
//                         {currentFile && fileTree[currentFile] && (
//                             <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
//                                 <pre className="hljs h-full">
//                                     <code
//                                         className="hljs h-full outline-none"
//                                         contentEditable
//                                         suppressContentEditableWarning
//                                         onBlur={(e) => {
//                                             const ft = {
//                                                 ...fileTree,
//                                                 [currentFile]: {
//                                                     file: {
//                                                         contents: e.target.innerText
//                                                     }
//                                                 }
//                                             }
//                                             setFileTree(ft)
//                                             saveFileTree(ft)
//                                         }}
//                                     >
//                                         {fileTree[currentFile].file?.contents || ''}
//                                     </code>
//                                 </pre>
//                             </div>
//                         )}
//                     </div>

//                     {iframeUrl && (
//                         <div className="flex min-w-96 flex-col h-full">
//                             <div className="address-bar">
//                                 <input type="text" value={iframeUrl} onChange={e => setIframeUrl(e.target.value)} className="w-full p-2 px-4 bg-slate-200" />
//                             </div>
//                             <iframe src={iframeUrl} className="w-full h-full"></iframe>
//                         </div>
//                     )}
//                 </div>
//             </section>

//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
//                         <header className='flex justify-between items-center mb-4'>
//                             <h2 className='text-xl font-semibold'>Select User</h2>
//                             <button onClick={() => setIsModalOpen(false)} className='p-2'>
//                                 <i className="ri-close-fill"></i>
//                             </button>
//                         </header>
//                         <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
//                             {users.map(u => (
//                                 <div key={u._id} className={`user cursor-pointer hover:bg-slate-200 ${Array.from(selectedUserId).includes(u._id) ? 'bg-slate-200' : ''} p-2 flex gap-2 items-center`} onClick={() => handleUserClick(u._id)}>
//                                     <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
//                                         <i className="ri-user-fill absolute"></i>
//                                     </div>
//                                     <h1 className='font-semibold text-lg'>{u.email}</h1>
//                                 </div>
//                             ))}
//                         </div>
//                         <button onClick={addCollaborators} className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>Add Collaborators</button>
//                     </div>
//                 </div>
//             )}
//         </main>
//     )
// }

// export default Project











import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js'
import { getWebContainer } from '../config/webContainer'

function parseCohereMessage(message) {
    if (!message) return { text: '', fileTree: null }
    let clean = message.replace(/```json/g, '').replace(/```/g, '').trim()
    try {
        const parsed = JSON.parse(clean)
        return { text: parsed.text || clean, fileTree: parsed.fileTree || null }
    } catch (err) {
        return { text: clean, fileTree: null }
    }
}

function SyntaxHighlightedCode({ children, className }) {
    const ref = useRef(null)
    useEffect(() => {
        if (ref.current && className?.includes('lang-')) {
            hljs.highlightElement(ref.current)
        }
    }, [children, className])
    return <code ref={ref} className={className}>{children}</code>
}

function normalizeFileTree(rawTree = {}) {
    const normalized = {}
    Object.entries(rawTree).forEach(([fileName, value]) => {
        if (value?.file?.contents !== undefined) {
            normalized[fileName] = value
        } else if (value?.contents !== undefined) {
            normalized[fileName] = { file: { contents: value.contents } }
        }
    })
    return normalized
}

const Project = () => {
    const location = useLocation()
    const { user } = useContext(UserContext)
    const messageBox = useRef(null)
    const webContainerRef = useRef(null)

    const [project, setProject] = useState(location.state.project)
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [selectedUserId, setSelectedUserId] = useState(new Set())
    const [fileTree, setFileTree] = useState({})
    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])
    const [iframeUrl, setIframeUrl] = useState(null)
    const [runProcess, setRunProcess] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // ------------------ Handlers ------------------
    const handleUserClick = (id) => {
        setSelectedUserId(prev => {
            const newSet = new Set(prev)
            newSet.has(id) ? newSet.delete(id) : newSet.add(id)
            return newSet
        })
    }

    const addCollaborators = () => {
        axios.put("/projects/add-user", {
            projectId: project._id,
            users: Array.from(selectedUserId)
        }).then(() => setIsModalOpen(false))
          .catch(console.log)
    }

    const send = () => {
        if (!message.trim()) return
        sendMessage('project-message', { message, sender: user })
        setMessages(prev => [...prev, { sender: user, message }])
        setMessage("")
    }

    const WriteAiMessage = (message) => {
        const msgObj = parseCohereMessage(message)
        return (
            <div className='overflow-auto bg-slate-950 text-white rounded-sm p-2'>
                <Markdown children={msgObj.text} options={{ overrides: { code: SyntaxHighlightedCode } }} />
            </div>
        )
    }

    const saveFileTree = (ft) => {
        axios.put('/projects/update-file-tree', { projectId: project._id, fileTree: ft })
            .then(console.log)
            .catch(console.log)
    }

    const downloadChatHistory = () => {
        const content = messages.map(msg => {
            const sender = msg.sender.email || 'Unknown'
            const text = msg.sender._id === 'ai' ? parseCohereMessage(msg.message)?.text : msg.message
            return `${sender}:\n${text}\n\n`
        }).join('')
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'chat-history.txt'
        a.click()
        URL.revokeObjectURL(url)
    }

    // ------------------ Effects ------------------
    useEffect(() => {
        initializeSocket(project._id)

        if (!webContainerRef.current) {
            getWebContainer()
                .then(container => webContainerRef.current = container)
                .catch(console.error)
        }

        receiveMessage('project-message', async (data) => {
            if (data.sender._id === 'ai') {
                const msg = parseCohereMessage(data.message)
                const container = webContainerRef.current
                if (msg.fileTree && container) {
                    try {
                        const normalizedTree = normalizeFileTree(msg.fileTree)
                        await container.mount(normalizedTree)
                        setFileTree(normalizedTree)
                        saveFileTree(normalizedTree)
                    } catch (err) { console.error(err) }
                }
                data.message = msg.text
            }
            setMessages(prev => [...prev, data])
        })

        axios.get(`/projects/get-project/${project._id}`)
            .then(res => {
                const normalizedTree = normalizeFileTree(res.data.project.fileTree)
                setFileTree(normalizedTree)
            })
            .catch(console.log)

        axios.get('/users/all')
            .then(res => setUsers(res.data.users))
            .catch(console.log)
    }, [])

    // ------------------ JSX ------------------
    return (
        <main className="flex h-screen w-screen">
            {/* ------------------ Explorer ------------------ */}
            <div className="explorer w-64 bg-slate-200 flex flex-col">
                <header className='p-2 flex justify-between items-center bg-slate-300'>
                    <button className='flex gap-2' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill"></i> Add collaborator
                    </button>
                    <button onClick={() => setIsModalOpen(!isModalOpen)} className='p-2'>
                        <i className="ri-group-fill"></i>
                    </button>
                </header>

                <div className="file-tree flex-1 overflow-auto p-2">
                    {Object.keys(fileTree).map((file, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setCurrentFile(file); setOpenFiles(prev => [...new Set([...prev, file])]) }}
                            className="w-full p-2 text-left hover:bg-slate-300 rounded"
                        >
                            {file}
                        </button>
                    ))}
                </div>

                <div className="chat flex flex-col p-2 border-t border-slate-300">
                    <div className="messages flex-1 overflow-auto">
                        {messages.map((msg, i) => (
                            <div key={i} className={`mb-2 p-1 rounded ${msg.sender._id === 'ai' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                                <small className="opacity-60">{msg.sender.email}</small>
                                <div>{msg.sender._id === 'ai' ? WriteAiMessage(msg.message) : msg.message}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex mt-2 gap-2">
                        <input
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            className="flex-1 p-1 border rounded"
                            placeholder="Message..."
                        />
                        <button onClick={send} className="bg-slate-800 text-white px-2 rounded">Send</button>
                        <button onClick={downloadChatHistory} className="bg-blue-600 text-white px-2 rounded">Download</button>
                    </div>
                </div>
            </div>

            {/* ------------------ Code Editor ------------------ */}
            <div className="code-editor flex-1 flex flex-col bg-slate-50">
                {/* Tabs + Run */}
                <div className="flex justify-between p-2 border-b border-slate-300">
                    <div className="tabs flex gap-2">
                        {openFiles.map((file, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentFile(file)}
                                className={`px-2 py-1 rounded ${currentFile === file ? 'bg-slate-300' : ''}`}
                            >
                                {file}
                            </button>
                        ))}
                    </div>
                    <button
                        className="bg-slate-800 text-white px-3 py-1 rounded"
                        onClick={async () => {
                            const container = webContainerRef.current
                            if (!container) return console.error("WebContainer not ready")
                            try {
                                await container.mount(fileTree)
                                const installProcess = await container.spawn("npm", ["install"])
                                installProcess.output.pipeTo(new WritableStream({ write(chunk) { console.log(chunk) } }))
                                if (runProcess) runProcess.kill()
                                const tempRunProcess = await container.spawn("node", ["app.js"])
                                tempRunProcess.output.pipeTo(new WritableStream({ write(chunk) { console.log(chunk) } }))
                                setRunProcess(tempRunProcess)
                                container.on('server-ready', (port, url) => setIframeUrl(url))
                            } catch (err) { console.error(err) }
                        }}
                    >
                        Run
                    </button>
                </div>

                {/* Editor */}
                <div className="flex-1 overflow-auto p-2">
                    {currentFile && fileTree[currentFile] && (
                        <pre className="h-full">
                            <code
                                className="hljs"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={e => {
                                    const ft = { ...fileTree, [currentFile]: { file: { contents: e.target.innerText } } }
                                    setFileTree(ft)
                                    saveFileTree(ft)
                                }}
                            >
                                {fileTree[currentFile].file.contents}
                            </code>
                        </pre>
                    )}
                </div>
            </div>

            {/* ------------------ Express Preview ------------------ */}
            <div className="preview w-96 bg-slate-100 flex flex-col">
                <input
                    type="text"
                    value={iframeUrl || ''}
                    onChange={e => setIframeUrl(e.target.value)}
                    className="p-2 border-b border-slate-300"
                    placeholder="Preview URL"
                />
                <iframe src={iframeUrl} className="flex-1 w-full h-full" />
            </div>

            {/* ------------------ Collaborators Modal ------------------ */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 max-h-96 overflow-auto mb-16">
                            {users.map(u => (
                                <div
                                    key={u._id}
                                    className={`user cursor-pointer hover:bg-slate-200 ${selectedUserId.has(u._id) ? 'bg-slate-200' : ''} p-2 flex items-center gap-2`}
                                    onClick={() => handleUserClick(u._id)}
                                >
                                    <div className='w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center'>
                                        <i className="ri-user-fill"></i>
                                    </div>
                                    <span>{u.email}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'
                        >
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project
