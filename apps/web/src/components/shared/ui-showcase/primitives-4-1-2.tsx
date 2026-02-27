"use client"

import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@talimy/ui"
import { Trash2 } from "lucide-react"

export function PrimitivesShowcase412() {
  return (
    <TooltipProvider>
      <div className="grid gap-8 md:grid-cols-2">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground">Dialog / Alert Dialog</h2>

          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dars jadvalini yangilash</DialogTitle>
                  <DialogDescription>
                    O'zgartirishlar saqlangandan keyin teacher panelda yangilanadi.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="secondary">Cancel</Button>
                  <Button>Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-destructive/12 text-destructive shadow-none hover:bg-destructive/20">
                  Delete Chat
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm overflow-hidden p-0">
                <AlertDialogHeader className="items-center px-6 pt-6 text-center">
                  <div className="mb-1 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/12 text-destructive">
                    <Trash2 className="h-7 w-7" />
                  </div>
                  <AlertDialogTitle>Delete chat?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this chat conversation. View{" "}
                    <a className="underline" href="#">
                      Settings
                    </a>{" "}
                    delete any memories saved during this chat.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="mt-6 grid grid-cols-2 gap-2 border-t bg-muted/20 p-4">
                  <AlertDialogCancel className="mt-0 w-full">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="w-full bg-destructive/12 text-destructive shadow-none hover:bg-destructive/20">
                    Delete
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <Alert>
            <AlertTitle>Integration status</AlertTitle>
            <AlertDescription>
              Queue worker bilan bog'liq yangi deployment 2 daqiqada kuchga kiradi.
            </AlertDescription>
          </Alert>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Dropdown / Popover / Tooltip
          </h2>

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Teacher row actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View profile</DropdownMenuItem>
                <DropdownMenuItem>Edit teacher</DropdownMenuItem>
                <DropdownMenuItem>Deactivate</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                Calendar event uchun quick-note yoki reminder text shu yerda ko'rsatiladi.
              </PopoverContent>
            </Popover>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Tenant scoped action</TooltipContent>
            </Tooltip>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}
