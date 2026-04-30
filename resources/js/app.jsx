import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import '../css/app.css'

import { GlobalAudioProvider } from "@/Context/GlobalAudioContext";
import { GlobalVideoProvider } from "@/Context/GlobalVideoContext";
import { AuthProvider } from "@/Context/AuthContext"; 

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
      if (pageEl?.textContent) {
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

      <AuthProvider> 

        <GlobalAudioProvider>
          <GlobalVideoProvider>

            {/* SAFE AREA WRAPPER */}
            <div className="min-h-[100dvh] w-full flex flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-white">

              <App {...props} initialPage={initialPage} />

            </div>

            {/* TOASTER */}
            <Toaster
              position="top-center"
              gutter={8}
              containerStyle={{
                top: "calc(75% - env(safe-area-inset-bottom))",
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
                  boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                  textAlign: "center",
                  maxWidth: "90%",
                },
              }}
            />

          </GlobalVideoProvider>
        </GlobalAudioProvider>

      </AuthProvider>
    )
  },
})