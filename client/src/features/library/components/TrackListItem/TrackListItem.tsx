import * as React from 'react';
import {Actions} from 'definitions/actions';
import {Track, LibraryState} from 'definitions';
import * as classnames from 'classnames';
import { ContextMenuTarget, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";

require('./TrackListItem.scss');

interface TrackListItemProps {
  actions: Actions;
  track: Track;
  library: LibraryState;
  playing: boolean;
  playHidden: boolean;
}
@ContextMenuTarget
export class TrackListItem extends React.Component<TrackListItemProps, {}>{
  public renderContextMenu() {
    
    // return a single element, or nothing to use default browser behavior
    return (
      <Menu>
        <MenuItem text={this.props.track.name} disabled/>
        <MenuDivider />
        <MenuItem iconName="pt-icon-play" text="Play track" />
        <MenuItem iconName="pt-icon-add-to-artifact" text="Play after this track" />
        <MenuDivider />
        <MenuItem onClick={() => this.props.actions.toggleHideTrack(this.props.track._id)}
          iconName={this.props.track.hidden ? 'pt-icon-eye-open' : "pt-icon-eye-off"}
          text={this.props.track.hidden ? 'Unhide' : "Hide from track list"} />
        <MenuItem iconName="pt-icon-disable" text="Remove" />
        <MenuItem iconName="pt-icon-trash" text="Delete" />
      </Menu>
    );
  }

  handleClick () {
    const {actions, track, library} = this.props;
    actions.replacePlayerStack([track.album, track.number], !this.props.playHidden);
  }
  render (): JSX.Element {
    const {actions, track, library, playing} = this.props;
    const date = new Date(null);
    date.setSeconds(track.duration || 0);

    const duration = date.toISOString().substr(14, 5);

    return <div className={classnames("track-list-item", {playing, hidden: track.hidden})} onClick={this.handleClick.bind(this)}>
      <div className="track-number">{track.number}</div>
      <div className="track-name">{track.name}</div>
      <div className="track-info"></div>
      <div className="track-duration">{duration}</div>
    </div>
  }
}
