import React, { ChangeEvent, useState } from "react";
import { observer } from "mobx-react";
import "./video-file.scss";
import { FileInput, InputGroup, MenuItem } from "@blueprintjs/core";
import { MultiSelect } from "@blueprintjs/select";
import { Store } from "../../store";

export const UploadVideoFilePage: React.FC = observer(() => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [availableTags, setAvailableTags] = useState(
    Store.stringValues.availableTags,
  );
  const [tags, setTags] = useState<string[]>([]);

  if (!file) {
    return (
      <div
        className="upload-video-file-page"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div className="file-input">
          <FileInput
            large
            inputProps={{
              accept: "video/*",
              onChange: (evt: ChangeEvent<HTMLInputElement>) => {
                const f = evt.target?.files?.[0] || null;
                if (!!f) {
                  setTitle(f.name);
                  setFile(f);
                }
              },
            }}
            text="Select a file to upload"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="upload-video-file-page">
      <div className="preview">
        <div className="video-container">
          <video controls src={URL.createObjectURL(file)} />
        </div>
      </div>
      <div className="inputs">
        <InputGroup placeholder="Title" large />
        <MultiSelect
          placeholder="Tags"
          fill
          tagRenderer={(item) => item}
          items={availableTags}
          createNewItemFromQuery={(e) => e}
          onItemSelect={(item) => {
            const newtags = [...tags, item];
            setTags(newtags);
            setAvailableTags(
              availableTags.filter((el) => !newtags.includes(el))
            );
          }}
          itemPredicate={(query, item, index, exactMatch) => {
            return exactMatch
              ? exactMatch
              : !!item.match(new RegExp(query, "i"));
          }}
          createNewItemRenderer={(query, active, handleClick) => {
            return (
              <MenuItem
                active={active}
                onClick={handleClick}
                shouldDismissPopover={true}
                text={`Create new tag: ${query}`}
              />
            );
          }}
          resetOnSelect={true}
          onRemove={(value) => {
            const newtags = tags.filter((el) => el !== value);
            setTags(newtags);
            setAvailableTags([...availableTags, value]);
          }}
          tagInputProps={{
            fill: true,
            large: true,
          }}
          itemRenderer={(item, itemProps) => {
            return (
              <MenuItem
                active={itemProps.modifiers.active}
                key={item}
                text={item}
                onClick={itemProps.handleClick}
                shouldDismissPopover={true}
              />
            );
          }}
          selectedItems={tags}
        />
      </div>
    </div>
  );
});
