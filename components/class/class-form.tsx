import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../ui/modal";


export default function ClassForm() {
    return (
        <Modal>
            <form>
                <ModalHeader>

                </ModalHeader>
                {/* Error/info */}
                <ModalBody className="flex p-4">
                    {/* class info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>Subject Dropdown</div>
                        <div>
                            <Label>Name</Label>
                            <Input  />
                        </div>
                        <div>
                            <Label>Module</Label>
                            <Input  />
                        </div>
                        <div>
                            <Label>Room</Label>
                            <Input  />
                        </div>
                        <div>
                            <Label>Building</Label>
                            <Input  />
                        </div>
                        <div>
                            <Label>Teacher</Label>
                            <Input  />
                        </div>
                    </div>
                    {/* Terms/year info */}
                    <div></div>
                </ModalBody>
                <ModalFooter className="flex justify-between px-4 py-2">
                    <div></div>
                    <div className="flex gap-2">
                        <Button variant={"outline"} size={"sm"} type="button">Cancel</Button>
                        <Button size={"sm"} type="button">Save</Button>
                    </div>
                </ModalFooter>
            </form>
        </Modal>
    )
}