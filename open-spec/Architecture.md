# **Architecture Documentation: File Management System**

## **Overview**

The **File Management System** is a modular, client-side React implementation designed for the CourseLLM platform. It provides teachers with a dedicated interface to upload, organize, and manage course materials. Currently, the system operates as a high-fidelity frontend prototype, leveraging browser-resident memory and Object URLs to simulate a persistent storage environment without immediate backend dependencies.

## **System Architecture**

### **Component Structure**

The system is built using a hierarchical, unidirectional data flow architecture consisting of three primary components and an orchestrating page:

* **Page (page.tsx)**: The route entry point that acts as the primary layout container.  
* **File-browser (file-browser.tsx)**: The "Smart Container" or controller component. It manages the internal state, authentication logic, and orchestrates file lifecycle events like uploading and deletion.  
* **File-card (file-card.tsx)**: A presentational component responsible for displaying metadata (name, size, date) for a single file and providing a user interface for specific actions (viewing, deleting).  
* **File-icon (file-icon.tsx)**: A utility component that maps file extensions to semantic icons using the lucide-react library.

### **Component Relationships & Data Flow**

1. **State Ownership**: The FileBrowser component owns the files state array and the objectUrls mapping.  
2. **Parent-to-Child**: FileBrowser maps over the files state to render multiple FileCard components, passing the file data and an onDelete callback as props.  
3. **Child-to-Parent**: When a user interacts with a FileCard (e.g., clicking "Delete"), the card invokes the onDelete callback, which triggers the deletion workflow in the FileBrowser.  
4. **Utility Usage**: Every FileCard utilizes FileIcon to visually differentiate file types (e.g., PDF vs. ZIP) based on the type property of the FileData object.

### **Technology Stack**

* **Framework**: Next.js 15.3.3 (App Router).  
* **Library**: React 18.3.1.  
* **Language**: TypeScript for strict type definitions (e.g., FileData, LucideProps).  
* **UI Primitives**: Radix UI (via shadcn/ui patterns) for accessible AlertDialog, DropdownMenu, and Button components.  
* **Iconography**: lucide-react 0.475.0.  
* **Styling**: Tailwind CSS for responsive and utility-first design.  
* **State Management**: React useState, useRef, and useEffect hooks for local state and resource lifecycle management.

## **Component Details**

### **File-browser Component**

* **Location**: src/app/teacher/file-management/\_components/file-browser.tsx.  
* **Purpose**: Acts as the central hub for file management operations and security gating.  
* **Key Features**:  
  * **Auth & Role Gating**: Uses useAuth to ensure only users with the teacher role can access the management interface; otherwise, it redirects to /student or /login.  
  * **Upload Management**: Uses a hidden file input and a useRef hook to handle local file selection.  
  * **Memory Management**: Implements a useEffect cleanup function to revoke blob: Object URLs on unmount, preventing browser memory leaks.  
  * **Mock Initialization**: Loads initialFiles from a static library for immediate UI feedback.  
* **Props Interface**:  
* TypeScript  
1. { initialFiles?: FileData\[\] }  
*   
*   
* **Dependencies**: useAuth, useRouter, lucide-react, and Radix UI components.

### **File-card Component**

* **Location**: src/app/teacher/file-management/\_components/file-card.tsx.  
* **Purpose**: Provides a visual summary and action menu for an individual file.  
* **Key Features**:  
  * **Card Interaction**: Clicking the card opens the file's url in a new browser tab.  
  * **Action Menu**: A DropdownMenu provides a "Delete" option, ensuring the event does not bubble up to the card's click handler via e.stopPropagation().  
  * **Metadata Display**: Shows the file name, size (formatted in KB/MB), and the localized upload date.  
* **Props Interface**:  
* TypeScript  
2. interface FileCardProps {  
3.   file: FileData;  
4.   onDelete: (file: FileData) \=\> void;  
5. }  
*   
*   
* **Dependencies**: lucide-react, FileIcon, and Radix UI Card and DropdownMenu primitives.

### **File-icon Component**

* **Location**: src/app/teacher/file-management/\_components/file-icon.tsx.  
* **Purpose**: Maps file extensions to their corresponding visual icons.  
* **Supported File Types**:  
  * **Document**: pdf, doc, docx (renders FileText).  
  * **Media**: mp4, mov, avi, webm (renders FileVideo); mp3, wav, ogg (renders FileAudio).  
  * **Image**: png, jpg, jpeg, gif, svg (renders FileImage).  
  * **Archive**: zip, rar, 7z (renders FileArchive).  
  * **Presentation**: ppt, pptx (renders Presentation).  
* **Props Interface**:  
* TypeScript  
6. { fileType: string } & LucideProps  
*   
* 

### **Page Integration (page.tsx)**

* **Location**: src/app/teacher/file-management/page.tsx.  
* **Purpose**: Orchestrates the main view for the file management route.  
* **Component Composition**: Wraps FileBrowser in a standard Next.js page layout with a title and container padding.

## **Data Flow**

The file lifecycle data flow is as follows:

1. **Upload**: User selects a file → FileBrowser creates an Object URL → A new FileData object is added to the files state array.  
2. **Display**: FileBrowser re-renders → Maps through files → Each FileCard renders with the file data and an onDelete callback.  
3. **Delete Initiation**: User clicks "Delete" on a FileCard → onDelete(file) is called → FileBrowser updates fileToDelete state → AlertDialog opens.  
4. **Confirm Delete**: User clicks "Confirm" → confirmDelete() removes the file from the state array and calls URL.revokeObjectURL() to free memory.

## **File Structure**

Plaintext

7. src/app/teacher/file-management/  
8. ├── page.tsx                    \# Main container/page entry  
9. └── \_components/                \# Feature-specific components  
10.     ├── file-browser.tsx        \# Logic and state management  
11.     ├── file-card.tsx           \# Individual file representation  
12.     └── file-icon.tsx           \# Icon utility mapping

## **Design Patterns**

* **Container/Presentational Pattern**: FileBrowser (Container) handles the data and logic, while FileCard and FileIcon (Presentational) handle the UI and styling.  
* **Compound Components**: Utilization of Radix UI's compound pattern for complex elements like AlertDialog and DropdownMenu.  
* **Resource Management Pattern**: Strict management of browser resources (Object URLs) using React side-effect cleanups.

## **Current Scope & Limitations**

* **Frontend Only**: All file operations (upload, delete) are transient and stored in the browser's memory.  
* **State Persistence**: Refreshing the page will reset the file list to the default initialFiles provided in src/lib/files.ts.  
* **Security**: Authentication is handled via client-side context (useAuth), which provides UI-level protection but lacks backend enforcement in the current prototype.

## **Dependencies**

* **lucide-react**: Standard icon library.  
* **radix-ui**: Low-level accessible UI primitives.  
* **tailwind-merge & clsx**: Utilities for merging Tailwind classes dynamically.

## **Future Enhancements**

* **Backend Integration**: Connect to Firebase Storage or a custom API to persist file uploads.  
* **Database Sync**: Update Firestore records whenever a file is uploaded or deleted to maintain cross-session persistence.  
* **Drag-and-Drop**: Implement a dedicated file drop-zone for improved user experience.  
* **File Previews**: Add modal-based previews for images and PDFs instead of opening them in a new tab.

