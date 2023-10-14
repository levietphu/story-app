# React + TypeScript + Vite

- node version 18.17.1
- Cài đặt Vitejs trên trang chủ: https://vitejs.dev/
- Setup ESLint và Prettier
  B1: Run the following command: npm i prettier eslint-config-prettier eslint-plugin-prettier -D
  B2: Config ESlint
      + Open file `.eslintrc.cjs`
      + Thêm đoạn giá trị này vào mảng `ignorePatterns`, mục đích là mình không muốn ESLint check file `vite.config.ts`: 'vite.config.ts'
      + Thêm đoạn code sau vào mảng extends: 'eslint-config-prettier', 'prettier'
      + Thêm đoạn code sau vào mảng plugins: 'prettier'
      + Thêm đoạn code sau vào object rules để thêm các rule của Prettier: 'prettier/prettier':
              'prettier/prettier': [
                  'warn',
                  {
                    arrowParens: 'always',
                    semi: false,
                    trailingComma: 'none',
                    tabWidth: 2,
                    endOfLine: 'auto',
                    useTabs: false,
                    singleQuote: true,
                    printWidth: 120,
                    jsxSingleQuote: true
                  }
                ]
  B3:  Config Prettier để format code
      + Tạo file `.prettierrc` trong thư trong thư mục root với nội dung dưới đây:
          {
          "arrowParens": "always",
          "semi": false,
          "trailingComma": "none",
          "tabWidth": 2,
          "endOfLine": "auto",
          "useTabs": false,
          "singleQuote": true,
          "printWidth": 120,
          "jsxSingleQuote": true
        }
      + Mục đích là cấu hình prettier. Anh em nên cài Extension Prettier - Code formatter cho VS Code để nó hiểu nhé.
          Tiếp theo Tạo file `.prettierignore` ở thư mục root
          Mục đích là Prettier bỏ qua các file không cần thiết: node_modules/
                                                                dist/
  B4: Config editor để chuẩn hóa cấu hình editor
      + Tạo file .editorconfig ở thư mục root
            Mục đích là cấu hình các config đồng bộ các editor với nhau nếu dự án có nhiều người tham gia.
            Để VS Code hiểu được file này thì anh em cài Extension là EditorConfig for VS Code nhé:
              [*]
            indent_size = 2
            indent_style = space
  B5:  Cấu hính alias cho `tsconfig.json`
      + Việc thêm alias vào file tsconfig.json sẽ giúp VS Code hiểu mà tự động import giúp chúng ta. Lưu ý cái này chỉ giúp
        Thêm đoạn này vào compilerOptions trong file tsconfig.json:
              "baseUrl": ".",
            "paths": {
              "~/*": ["src/*"]
            }
          Ý nghĩa của đoạn này là ta có thể import Login from '~/pages/Login' thay vì import Login from '../../pages/Login'. Ngắn gọn và dễ nhìn hơn nhiều!
  B6: Cấu hình alias cho vite `vite.config.ts`
      + Cài package @types/node để sử dụng node js trong file ts không bị lỗi: npm i @types/node -D
      + Cấu hình alias và enable source map ở file `vite.config.ts`:
              import { defineConfig } from 'vite'
                import react from '@vitejs/plugin-react-swc'
                import path from 'path'
                
                // https://vitejs.dev/config/
                export default defineConfig({
                  plugins: [react()],
                  server: {
                    port: 3000
                  },
                  css: {
                    devSourcemap: true
                  },
                  resolve: {
                    alias: {
                      '~': path.resolve(__dirname, './src')
                    }
                  }
                })
  B7: Cập nhật script cho `package.json`
      + Mở file package.json lên, thêm đoạn script dưới vào:
          "scripts": {
            //...
            "lint:fix": "eslint --fix src --ext ts,tsx",
            "prettier": "prettier --check \"src/**/(*.tsx|*.ts|*.css|*.scss)\"",
            "prettier:fix": "prettier --write \"src/**/(*.tsx|*.ts|*.css|*.scss)\""
        }
      
