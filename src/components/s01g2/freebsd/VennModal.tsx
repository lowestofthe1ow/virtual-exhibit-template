import mod from 'astro/zod';
import { useRef, forwardRef, useEffect } from 'react'

const VennModal = forwardRef((props, ref) => {
    const modalRef = useRef(null)
    const modalContentRef = useRef(null)
    const modalTitleRef = useRef(null)

    function openModal () {
        if (!modalRef.current)
            return
        modalRef.current.className = 'active'
    }

    function closeModal () {
        if (!modalRef.current)
            return
        modalRef.current.className = 'inactive'
    }

    useEffect(() => {
        function handleOpenModal(event) {
            openModal()
            modalContentRef.current.innerHTML = event.detail.target.firstElementChild.innerHTML
            modalTitleRef.current.innerText = event.detail.title
        }
        
        function handleCloseModal(event) {
            closeModal()
        }

        window.addEventListener('openModal', handleOpenModal)
        window.addEventListener('closeModal', handleCloseModal)

        return () => {
            window.removeEventListener('openModal', handleOpenModal)
            window.removeEventListener('closeModal', handleCloseModal)
        };
    })
    
    return (
        <div ref={modalRef} id="venn-modal" className="inactive">
            <div id="venn-modal-container">
                <span id="venn-modal-header">
                    <h1 ref={modalTitleRef} >Title Here</h1>
                    <span id="venn-modal-close" onClick={closeModal}>🗙</span>
                </span>
                <span ref={modalContentRef} id="venn-modal-content"></span>
            </div>
        </div>
    );
})

export default VennModal;
