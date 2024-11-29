'use client'

import React, {FC, useState} from "react";
import {createRoot} from "react-dom/client";
import ReactDOM from "react-dom";
import {Button} from "@/components/ui/button";
import {X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

// Modal component
interface ModalProps {
    text: string;
    onClose: (result: boolean) => void;
    title: string;
    buttonFalse: string;
    buttonTrue: "Confirm" | "Delete" | "Remove";
    confirmValue?: string;
}

const Modal: FC<ModalProps> = ({
                                   text,
                                   onClose,
                                   title,
                                   buttonFalse,
                                   buttonTrue,
                                   confirmValue
                               }) => {
    const [confirmValueMatch, setConfirmValueMatch] = useState('');
    return ReactDOM.createPortal(
        <div className={'flex items-center justify-center inset-0 fixed z-10'}>
            <div className="inset-0 fixed z-10 backdrop-blur-sm"
                 onClick={() => onClose(false)}
            >
            </div>
            <div className="bg-base-100 p-6 rounded-lg relative border-2 border-neutral m-4 z-20">
                <div className="flex items-center justify-end">
                    <X
                        className="cursor-pointer"
                        onClick={() => onClose(false)}
                    />
                </div>
                <h3 className="font-bold text-lg mr-8">{title}</h3>
                <p className="mr-24 mb-8">{text}</p>
                <div className={cn('flex flex-col gap-2')}>
                    {
                        confirmValue && <>
                            <p>
                                Please type <span className={cn('font-semibold')}>&quot;{confirmValue}&quot;</span> to
                                confirm.
                            </p>
                            <Input type={"text"} placeholder={confirmValue}
                                   onChange={(e) => setConfirmValueMatch(e.target.value)}/>
                        </>

                    }
                    <div className="flex items-center gap-2 w-full justify-end">
                        <Button
                            variant={"outline"}
                            onClick={() => onClose(false)}
                        >
                            {buttonFalse}
                        </Button>
                        <Button
                            disabled={confirmValueMatch !== confirmValue && confirmValue !== undefined}
                            onClick={() => onClose(true)}
                            className={
                                (buttonTrue == "Confirm" ? "bg-primary text-primary-foreground" : "bg-error text-error-content")
                            }
                        >
                            {buttonTrue}
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export const confirmModal = ({
                                 title = "Confirm",
                                 text = "This action can not be reverted.",
                                 buttonTrue = "Confirm",
                                 buttonFalse = "Cancel",
                                 confirmValue
                             }: {
    title?: string;
    text?: string;
    buttonTrue?: "Confirm" | "Delete" | "Remove";
    buttonFalse?: string;
    confirmValue?: string;
}): Promise<boolean> => {
    return new Promise((resolve) => {
        const handleClose = (result: boolean) => {
            resolve(result);
            removeModal();
        };

        const modalElement = document.createElement("div");
        document.body.appendChild(modalElement);

        const removeModal = () => {
            root.unmount();
            document.body.removeChild(modalElement);
        };

        const root = createRoot(modalElement);
        root.render(
            <Modal
                text={text}
                title={title}
                buttonFalse={buttonFalse}
                buttonTrue={buttonTrue}
                onClose={handleClose}
                confirmValue={confirmValue}
            />
        );
    });
};
