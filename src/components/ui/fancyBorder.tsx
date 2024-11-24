import React from "react";

const FancyBorder: React.FC<{ children: React.ReactNode, className?: string }> = ({children, className, ...props}) => {
    return (
        <div className={`fancy-border-1 grid ${className}`} {...props}>
            <div className={'fancy-border-2 col-start-1 row-start-1'}>
            </div>
            <div className={"col-start-1 row-start-1"}>
                {children}
            </div>
        </div>
    );
}

export default FancyBorder;