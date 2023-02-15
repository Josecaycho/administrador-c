/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    basePath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
    publicRuntimeConfig: {
        contextPath: process.env.NODE_ENV === 'production' ? '/sakai-react' : '',
        uploadPath: process.env.NODE_ENV === 'production' ? '/sakai-react/upload.php' : '/api/upload'
    },
    env: {
        API_GATEWAY_URL: process.env.API_GATEWAY_URL,
        API_GATEWAY_NAME: process.env.API_GATEWAY_NAME,
        API_GATEWAY_REGION: process.env.API_GATEWAY_REGION
    },
};

module.exports = nextConfig;