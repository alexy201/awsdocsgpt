import * as React from "react";
import {useRef} from "react";

export interface CourseSelectorProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const CourseSelector = React.forwardRef<HTMLSelectElement, CourseSelectorProps>(
    ({ className, ...props }, ref) => {
      const selectorRef = useRef<HTMLSelectElement | null>(null)
      const select = selectorRef.current!
      return (
        <label>
          Pick a Course:
          <select name="selectedCourse" defaultValue="All Courses" ref={selectorRef} {...props}>
            <option value="">All Courses</option>
            <option value="Theory of Numbers">Theory of Numbers</option>
            <option value="Course 2">Course 2</option>
            <option value="Course 3">Course 3</option>
          </select>
        </label>
      );
})

CourseSelector.displayName = "CourseSelector";

export default CourseSelector;
