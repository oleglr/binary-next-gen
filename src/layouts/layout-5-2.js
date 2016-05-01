import React from 'react';

export default (components, className, onClick) => (
    <div className={className} onClick={onClick}>
        <div>
            {components[0]}
            {components[1]}
            {components[2]}
            {components[3]}
        </div>
        {components[4]}
    </div>
);
