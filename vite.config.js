import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        properties: resolve(__dirname, 'properties.html'),
        propertyDetail: resolve(__dirname, 'property-detail.html'),
        addProperty: resolve(__dirname, 'add-property.html'),
        editProfile: resolve(__dirname, 'edit-profile.html'),
      }
    }
  }
})
