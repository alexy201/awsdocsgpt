import * as React from "react";
import {useRef} from "react";
import { Label } from "@/components/ui/label";

export interface CourseSelectorProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const CourseSelector = React.forwardRef<HTMLSelectElement, CourseSelectorProps>(
    ({ className, ...props }, ref) => {
      const selectorRef = useRef<HTMLSelectElement | null>(null)
      const select = selectorRef.current!
      return (
        <React.Fragment>
            <div className="relative mt-2 flex w-full items-start gap-4">
            <Label htmlFor="selectedCourse" className="font-mono col-span-3 text-left text-2xl">
              Pick a Course: &nbsp;&nbsp;
              <select name="selectedCourse" defaultValue="All Courses" ref={selectorRef} {...props}>
                <option value="">All Courses</option>
                <option value="08bc3f3a9a39a3e3f6cd7fcfb9d8eda8">Introduction to Algorithms</option>
                <option value="a2a1add0709dbe49eb32d8408845ee6f">Design and Analysis of Algorithms</option>
                <option value="f5d4bf19ee14590de94d9e2b266614ba">Single Variable Calculus</option>
                <option value="3caf857bc5c2495393d761d529a6b62b">Differential Equations</option>
                <option value="8441198fa1470d756f1cebc3104ff77d">The Early Universe</option>
                <option value="4cc828ff9c6e246aa4a08f7c12251ced">Quantum Physics II</option>
                <option value="9a9c1d7b7f014ddba45382915871db93">Power Electronics</option>
                <option value="94c079869dc21ad55c2ec841c2b3c839">Physical Chemistry</option>
                <option value="a18b80296ad4d54800dbcdd1f6c1ac1f">Performance Engineering of Software Systems</option>
                <option value="922fbc1356cc9430c001c928c4d41025">Principles of Microeconomics</option>
                <option value="0d05d096e6a2231356cbefdb39c5893f">Theory of Numbers</option>
              </select>
            </Label>
            </div>
        </React.Fragment>
    );
    })

    CourseSelector.displayName = "CourseSelector";

export default CourseSelector;
