// import React, { ChangeEvent, useState } from "react";
// import {
//   Autocomplete,
//   Box,
//   Button,
//   TextField,
//   useMediaQuery,
// } from "@mui/material";
// import { observer } from "mobx-react";
// import { createFilterOptions } from "@mui/material/Autocomplete";
// import { VideoCall } from "@mui/icons-material";
//
// const optionsFilter =
//   createFilterOptions<{ inputValue?: string; value: string }>();
//
// export const UploadVideoFile: React.FC = observer(() => {
//   const isMobile = useMediaQuery("(max-width:500px)");
//
//   const [file, setFile] = useState<File | null>(null);
//   const [title, setTitle] = useState("");
//   const [tags, setTags] = useState([]);
//
//   return (
//     <Box
//       width="100%"
//       display="flex"
//       gap="2rem"
//       justifyContent="center"
//       flexDirection={isMobile ? (!!file ? "column" : "row") : "row"}
//     >
//       {!file && (
//         <label
//           style={{
//             position: "absolute",
//             top: "50%",
//             margin: "auto",
//           }}
//           htmlFor="contained-button-file"
//         >
//           <input
//             accept="video/*"
//             style={{ display: "none" }}
//             id="contained-button-file"
//             type="file"
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               setFile(e.target?.files?.[0] || null)
//             }
//           />
//           <Button
//             endIcon={<VideoCall />}
//             size="large"
//             variant="contained"
//             component="span"
//           >
//             Choose a video to upload
//           </Button>
//         </label>
//       )}
//       {!!file && (
//         <>
//           <Box
//             width={isMobile ? "100%" : "65%"}
//             display="flex"
//             flexDirection="column"
//           >
//             <div
//               style={{
//                 width: "100%",
//                 paddingTop: "56.25%",
//                 height: "0px",
//                 position: "relative",
//               }}
//             >
//               <video
//                 style={{
//                   width: "100%",
//                   height: "100%",
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   background: "black",
//                 }}
//                 controls
//                 src={URL.createObjectURL(file)}
//               />
//             </div>
//           </Box>
//           <Box
//             width={isMobile ? "100%" : "35%"}
//             display="flex"
//             flexDirection="column"
//           >
//             <TextField
//               label="Title"
//               defaultValue={file.name}
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//             <Autocomplete
//               value={tags}
//               multiple
//               filterOptions={(options, params) => {
//                 const filtered = optionsFilter(options, params);
//                 const {inputValue} = params;
//
//                 return filtered;
//               }}
//               renderInput={(params) => (
//                 <TextField {...params} variant="outlined" label="Tags" />
//               )}
//               options={["Tag1", "Tag2", "Tag3", "Tag4"]}
//             />
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// });
