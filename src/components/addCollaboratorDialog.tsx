import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {ChangeEvent, useEffect, useState} from "react";
import {getUsersAction} from "@/actions/getUsersAction";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {createCollaborationAction} from "@/actions/createCollaborationAction";
import {TourToUserRole} from "@prisma/client";

interface User {
    id: string
    name: string | null
    username: string | null
    avatar: string | null
}

export function AddCollaboratorDialog({tour, ...props}: { tour: any, [key: string]: any }) {
    const [collaborator, setCollaborator] = useState<User | null>(null);
    const [collaborators, setCollaborators] = useState<User[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [noFound, setNotFound] = useState(false);
    const exclude = tour.TourToUser.map((ttu: any) => ttu.user.username)

    useEffect(() => {
        if (!searchValue) return;
        const delayDebounceFn = setTimeout(() => {
            getUsersAction(searchValue, 10, exclude).then((users) => {
                setCollaborators(users);
                if (users.length === 0) setNotFound(true);
                else setNotFound(false);
            });
        }, 200);

        return () => clearTimeout(delayDebounceFn);
    }, [exclude, searchValue]);


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" {...props}>Add</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Collaborator</DialogTitle>
                    <DialogDescription>
                        Add a collaborator to this tour. They will be added as viewers by default, but you can change
                        their role afterwards.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {
                        !collaborator &&
                        <div className="space-y-2">
                            <Label htmlFor="search" className="text-right">
                                Search for a user by name or username
                            </Label>
                            <Input id="search" value={searchValue} className="col-span-3"
                                   onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue((e.target.value))}/>
                        </div>
                    }
                    {
                        collaborator &&
                        <div className="flex items-center justify-between gap-4 border-2 border-neutral rounded-md p-2">
                            <div className={'flex items-center gap-2'}>
                                <Avatar className="h-10 w-10 overflow-hidden border-neutral border-2">
                                    <AvatarImage src={collaborator.avatar as string} alt={collaborator.name as string}/>
                                    <AvatarFallback className="rounded-lg">
                                        {collaborator?.name?.split(' ').map((name: string) => name[0].toUpperCase()).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div>{collaborator.name}</div>
                                    <div className="text-sm text-gray-500">{collaborator.username}</div>
                                </div>
                            </div>
                            <Button variant="outline" onClick={() => setCollaborator(null)}>Change</Button>
                        </div>
                    }
                    {!collaborator && collaborators.length > 0 &&
                        <div className="flex flex-col border-2 border-neutral rounded-md overflow-hidden">
                            <div className={'flex flex-col overflow-auto max-h-48 gap-2'}>
                                {collaborators.map((user) => (
                                    <CollaboratorItem key={user.id} user={user} setCollaborator={setCollaborator}/>
                                ))}
                            </div>
                        </div>
                    }
                    {
                        noFound && <div className="text-center text-gray-500">No users found</div>
                    }
                </div>
                <DialogFooter>
                    <Button disabled={!collaborator}
                            onClick={async () => {
                                await createCollaborationAction(tour.id, collaborator?.id as string, TourToUserRole.VIEWER, `/${tour.owner}/${tour.name}/settings`)
                            }}
                    >Add Collaborator</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const CollaboratorItem = ({user, setCollaborator}: { user: User, setCollaborator: any }) => {
    return (
        <div
            className="flex items-center justify-between gap-4 hover:bg-base-300 transition cursor-pointer duration-200 p-2 rounded-md"
            onClick={() => setCollaborator(user)}>
            <div className={'flex items-center gap-2'}>
                <Avatar className="h-10 w-10 overflow-hidden border-neutral border-2">
                    <AvatarImage src={user.avatar as string} alt={user.name as string}/>
                    <AvatarFallback className="rounded-lg">
                        {user?.name?.split(' ').map((name: string) => name[0].toUpperCase()).join('')}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div>{user.name}</div>
                    <div className="text-sm text-gray-500">{user.username}</div>
                </div>
            </div>
        </div>
    )
}