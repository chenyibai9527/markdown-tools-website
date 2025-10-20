import { useEffect, useRef, useCallback } from 'react'

export function useScrollSync(
  editorRef: React.RefObject<any>,
  previewRef: React.RefObject<HTMLDivElement>,
  enabled: boolean = true
) {
  const isScrollingFromEditor = useRef(false)
  const isScrollingFromPreview = useRef(false)
  const scrollTimeoutRef = useRef<number | undefined>(undefined)

  const getEditorScroller = useCallback(() => {
    if (!editorRef.current) return null

    // Try multiple approaches to find CodeMirror scroller
    const editorContainer = editorRef.current

    // Method 1: Check if editorContainer is the CodeMirror component
    if (editorContainer && typeof editorContainer.querySelector === 'function') {
      const scroller = editorContainer.querySelector('.cm-scroller')
      if (scroller) return scroller as HTMLElement
    }

    // Method 2: Check if there's a view property (common in @uiw/react-codemirror)
    if (editorContainer.view && editorContainer.view.dom) {
      const scroller = editorContainer.view.dom.querySelector('.cm-scroller')
      if (scroller) return scroller as HTMLElement
    }

    // Method 3: Look in the parent/ancestor elements
    let currentElement = editorContainer
    while (currentElement && currentElement.parentElement) {
      const scroller = currentElement.parentElement.querySelector('.cm-scroller')
      if (scroller) return scroller as HTMLElement
      currentElement = currentElement.parentElement
    }

    // Method 4: Global search as last resort
    const globalScroller = document.querySelector('.cm-scroller')
    if (globalScroller) return globalScroller as HTMLElement

    return null
  }, [editorRef])

  const syncScrollFromEditor = useCallback(() => {
    console.log('Editor scroll event triggered')
    if (!enabled || isScrollingFromPreview.current || !editorRef.current || !previewRef.current) {
      console.log('Editor scroll: Conditions not met', { enabled, isScrollingFromPreview: isScrollingFromPreview.current, hasEditorRef: !!editorRef.current, hasPreviewRef: !!previewRef.current })
      return
    }

    const editorScroller = getEditorScroller()
    const preview = previewRef.current

    if (!editorScroller || !preview) {
      console.log('Editor scroll: Missing elements', { hasEditorScroller: !!editorScroller, hasPreview: !!preview })
      return
    }

    isScrollingFromEditor.current = true

    const scrollPercentage = editorScroller.scrollTop / (editorScroller.scrollHeight - editorScroller.clientHeight)
    const targetScrollTop = scrollPercentage * (preview.scrollHeight - preview.clientHeight)

    console.log('Editor scroll: Syncing', {
      editorScrollTop: editorScroller.scrollTop,
      editorScrollHeight: editorScroller.scrollHeight,
      editorClientHeight: editorScroller.clientHeight,
      scrollPercentage,
      targetScrollTop,
      previewScrollHeight: preview.scrollHeight,
      previewClientHeight: preview.clientHeight
    })

    preview.scrollTop = targetScrollTop

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingFromEditor.current = false
      console.log('Editor scroll: Sync completed, re-enabling')
    }, 100)
  }, [enabled, editorRef, previewRef, getEditorScroller])

  const syncScrollFromPreview = useCallback(() => {
    if (!enabled || isScrollingFromEditor.current || !editorRef.current || !previewRef.current) {
      return
    }

    const editorScroller = getEditorScroller()
    const preview = previewRef.current

    if (!editorScroller || !preview) {
      return
    }

    isScrollingFromPreview.current = true

    const scrollPercentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight)
    const targetScrollTop = scrollPercentage * (editorScroller.scrollHeight - editorScroller.clientHeight)

    editorScroller.scrollTop = targetScrollTop

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingFromPreview.current = false
    }, 100)
  }, [enabled, editorRef, previewRef, getEditorScroller])

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Wait a bit for CodeMirror to fully render
    const timeoutId = setTimeout(() => {
      const editorScroller = getEditorScroller()
      const preview = previewRef.current

      console.log('Scroll sync setup:', {
        editorScroller: !!editorScroller,
        preview: !!preview,
        editorRef: !!editorRef.current
      })

      if (!editorScroller || !preview) {
        console.log('Scroll sync: Missing elements, retrying...')
        return
      }

      console.log('Scroll sync: Adding event listeners')
      editorScroller.addEventListener('scroll', syncScrollFromEditor)
      preview.addEventListener('scroll', syncScrollFromPreview)

      // Store cleanup function
      const cleanup = () => {
        console.log('Scroll sync: Removing event listeners')
        editorScroller.removeEventListener('scroll', syncScrollFromEditor)
        preview.removeEventListener('scroll', syncScrollFromPreview)

        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      }

      // Store cleanup for when effect unmounts
      ;(window as any).__scrollSyncCleanup = cleanup
    }, 500) // Wait 500ms for CodeMirror to render

    return () => {
      clearTimeout(timeoutId)
      if ((window as any).__scrollSyncCleanup) {
        (window as any).__scrollSyncCleanup()
        delete (window as any).__scrollSyncCleanup
      }
    }
  }, [enabled, editorRef, previewRef, getEditorScroller, syncScrollFromEditor, syncScrollFromPreview])

  return {
    syncScrollFromEditor,
    syncScrollFromPreview
  }
}