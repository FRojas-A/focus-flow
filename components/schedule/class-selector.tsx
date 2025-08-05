import { Database } from "@/database.types";
import { Button } from "../ui/button";
import ClassFormController from "../class/class-form-controller";

type SubjectRecord = Database["public"]["Tables"]["subjects"]["Row"];
type BasicClassRecord = Database["public"]["Views"]["basic_class_by_year"]["Row"];

export default function ClassSelector({ subjects, classes }: { subjects: SubjectRecord[], classes: BasicClassRecord[] }) {
    console.log(subjects, classes);

    return (
        <div>
            <div className="flex justify-between items-center px-4 py-2 border-b">
                {/* subject selector */}
                <div>All Classes</div>
                <div>
                    <ClassFormController>
                        <Button size={"sm"} type="button">New Class</Button>
                    </ClassFormController>
                </div>
            </div>
            {classes.map((studenClass, index) => {
                return (
                    <div key={index}>{studenClass.class_name}</div>
                )
            })}
        </div>
    )
}