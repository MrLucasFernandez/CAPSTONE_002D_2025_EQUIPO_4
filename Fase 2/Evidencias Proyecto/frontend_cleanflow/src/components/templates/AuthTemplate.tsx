import React from 'react';

type AuthTemplateProps = {
  children: React.ReactNode;
  title: string;
};

const AuthTemplate: React.FC<AuthTemplateProps> = ({ children, title }) => {
  return (
    <div 
      className="
        min-h-screen 
        flex 
        items-center 
        justify-center 
        bg-gray-100 
        p-4
      "
    >
      <div 
        className="
          w-full 
          max-w-md 
          bg-white 
          rounded-xl 
          shadow-2xl 
          p-8 
          sm:p-10
        "
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

export default AuthTemplate;