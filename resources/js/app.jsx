import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import '../css/app.css'

import { GlobalAudioProvider } from "@/Context/GlobalAudioContext";
import { GlobalVideoProvider } from "@/Context/GlobalVideoContext";
import { AuthProvider } from "@/Context/AuthContext"; 

setTimeout(function() {
    if (window.AndroidPHP && window.AndroidPHP.requestNotificationPermission) {
        window.AndroidPHP.requestNotificationPermission();
    } else if (window.AndroidPHP) {
        console.log('AndroidPHP exists but no requestNotificationPermission');
    } else {
        console.log('AndroidPHP not found - will retry');
        setTimeout(function() {
            if (window.AndroidPHP && window.AndroidPHP.requestNotificationPermission) {
                window.AndroidPHP.requestNotificationPermission();
            }
        }, 3000);
    }
}, 3000);
setTimeout(() => {
    if (window.Native) {
        window.Native.on('push-token', (data) => {
            console.log('FCM Token received:', data.token);
            
            fetch('https://backend.quickhomeloan.in/public/api/fcm/save-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fcm_token: data.token,
                    device: 'android'
                })
            })
            .then(response => response.json())
            .then(data => console.log('Token saved:', data))
            .catch(error => console.error('Error saving token:', error));
        });
    }
}, 1000);

window.requestNotificationPermission = function() {
    if (window.AndroidPHP && window.AndroidPHP.requestNotificationPermission) {
        window.AndroidPHP.requestNotificationPermission();
    } else {
        console.log('AndroidPHP not ready yet');
    }
};

createInertiaApp({
  id: 'app',

resolve: (name) => {

  const pages = import.meta.glob(
    [
      './Pages/**/*.jsx',
      './Components/**/*.jsx',
    ],
    { eager: true }
  )

  const page =
    pages[`./Pages/${name}.jsx`] ||
    pages[`./Components/${name}.jsx`]

  if (!page) {
    throw new Error(
      `Page not found: ${name}`
    )
  }

  return page
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

            <div className="min-h-[100dvh] w-full flex flex-col overflow-hidden pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-[#f3f4f6]">

              <App {...props} initialPage={initialPage} />

            </div>

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