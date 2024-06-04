import { cn } from "../utils/utils";

type ContainerProps = {
    children?: React.ReactNode,
    className? :  string
};

export const Msgbox = ({ children , className}: ContainerProps) => {
    
    return (
        <div className={cn("" , className)}>
            {children}
        </div>
    );
};
