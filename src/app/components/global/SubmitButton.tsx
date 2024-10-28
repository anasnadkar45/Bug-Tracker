import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useFormStatus } from "react-dom";

interface buttonProps {
    text: string;
    variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
}

export function SubmitButton({ text, variant }: buttonProps) {
    const { pending } = useFormStatus();
    return (
        <>
            {pending ? (
                <Button disabled variant={variant}>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                </Button>
            ) : (
                <Button variant={variant} type="submit">
                    {text}
                </Button>
            )}
        </>
    );
}

export function DeleteButton({ text, variant }: buttonProps) {
    const { pending } = useFormStatus();
    return (
        <>
            {pending ? (
                <Button size={"icon"} disabled variant={variant}>
                    <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
            ) : (
                <Button size={"icon"} variant={"destructive"} type="submit" >
                    <Trash className='size-4'/>
                    {text}
                </Button>
            )}
        </>
    );
}