import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import '../css/app.css'
import { GlobalAudioProvider } from "@/Context/GlobalAudioContext";
import { GlobalVideoProvider } from "@/Context/GlobalVideoContext";
createInertiaApp({
  id: 'app',

  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },

  setup({ el, App, props }) {
    let initialPage = props?.initialPage

    if (!initialPage) {
      const pageEl = document.querySelector('script[data-page]')

      if (pageEl && pageEl.textContent) {
        try {
          initialPage = JSON.parse(pageEl.textContent)
          pageEl.remove()
        } catch (e) {
          console.error('Inertia JSON parse error:', e)
        }
      }
    }

    if (!initialPage) {
      console.error('Inertia initialPage missing')
      return
    }

    createRoot(el).render(
   <GlobalAudioProvider>
    <GlobalVideoProvider>
    
    <App {...props} initialPage={initialPage} />

    <Toaster
      position="top-center"
      gutter={8}
      containerStyle={{
        top: "75%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      toastOptions={{
        duration: 2500,
        style: {
          background: "rgba(0, 0, 0, 0.75)",
          color: "#fff",
          padding: "14px 18px",
          borderRadius: "14px",
          fontSize: "14px",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          textAlign: "center",
          maxWidth: "90%",
        },
        success: {
          iconTheme: {
            primary: "#fff",
            secondary: "rgba(0,0,0,0.75)",
          },
        },
        error: {
          iconTheme: {
            primary: "#fff",
            secondary: "rgba(0,0,0,0.75)",
          },
        },
      }}
    />

   </GlobalVideoProvider>
  </GlobalAudioProvider>
)
  },
  
})