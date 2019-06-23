import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from 'react-jss';
import { useDrag, useDrop } from 'react-dnd';
import { DND_ITEM_TYPES } from 'constants/config';
import tooltipActions from 'core/tooltip/actions';
import characterSheetActions from 'core/characterSheet/actions';
import bgMember from 'assets/img/bg-member.png';
import bgBar from 'assets/img/bg-bar.png';
import barHp from 'assets/img/bg-barHp.png';
import iconLightning from 'assets/img/icon-lightning.png';

const styles = {
  character: {
    position: 'relative',
    height: 24,
    width: 110,
    background: `url(${bgMember}) 0 0 no-repeat`,
  },
  name: {
    position: 'absolute',
    width: 70,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 8,
    top: 3,
    left: 2,
    color: '#fff',
  },
  hp: {
    position: 'absolute',
    textAlign: 'right',
    padding: '2px 20px 0 0',
    fontSize: 8,
    color: 'green',
    top: 1,
    right: 2,
    width: '50%',
  },
  resources: {
    position: 'absolute',
    textAlign: 'right',
    color: 'yellow',
    fontSize: 8,
    bottom: 2,
    right: 4,
    '&:before': {
      position: 'absolute',
      top: 0,
      left: 0,
      content: '""',
      background: `url(${iconLightning}) 0 0 no-repeat`,
      height: 9,
      width: 6,
      margin: '-1px 0 0 -7px',
    },
  },
  barBg: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 19,
    height: 11,
    background: `url(${bgBar}) 0 0 no-repeat`,
  },
  barHp: {
    width: '100%',
    height: 10,
    background: `url(${barHp}) 0 0 no-repeat`,
  },
};

const Character = ({
  classes,
  data,
  dispatchTooltipSetText,
  dispatchCharacterSheetShow,
  move,
  index,
  id,
}) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: DND_ITEM_TYPES.CHARACTER,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      move(dragIndex, hoverIndex);
      // eslint-disable-next-line
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: DND_ITEM_TYPES.CHARACTER, id, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <li
      className={classes.character}
      ref={ref}
      style={{ opacity }}
      onClick={() => dispatchCharacterSheetShow(data)}
    >
      <div className={classes.name}>{data.name}</div>
      <div
        className={classes.hp}
        onMouseEnter={() => dispatchTooltipSetText(`Hit Points: ${data.HP_CUR} of ${data.HP_MAX}`)}
        onMouseLeave={() => dispatchTooltipSetText('')}
      >
        {data.HP_CUR}
        <div className={classes.barBg}>
          <div className={classes.barHp} />
        </div>
      </div>
      {data.ENERGY_MAX > 0 && (
        <span
          className={classes.resources}
          onMouseEnter={() =>
            dispatchTooltipSetText(`Energy: ${data.ENERGY_CUR} of ${data.ENERGY_MAX}`)
          }
          onMouseLeave={() => dispatchTooltipSetText('')}
        >
          {data.ENERGY_CUR}
        </span>
      )}
    </li>
  );
};

Character.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  move: PropTypes.func.isRequired,
  dispatchTooltipSetText: PropTypes.func.isRequired,
  dispatchCharacterSheetShow: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  dispatchTooltipSetText: tooltipActions.setText,
  dispatchCharacterSheetShow: characterSheetActions.show,
};

const StyledCharacter = withStyles(styles)(Character);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyledCharacter);
