import { cyan, generate, green, presetPalettes, red } from '@ant-design/colors';
import { Col, ColorPicker, Divider, Row, theme } from 'antd';
import type { ColorPickerProps } from 'antd';
import { AggregationColor } from 'antd/es/color-picker/color';

type Presets = Required<ColorPickerProps>['presets'][number];

function genPresets(presets = presetPalettes) {
  return Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors, key: label }));
}

const ColorPickerComponent = ({ defaultValue, onChange }: { defaultValue?: string, onChange: (color: AggregationColor) => void }) => {
  const { token } = theme.useToken();

  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
    cyan,
  });

  const customPanelRender: ColorPickerProps['panelRender'] = (
    _,
    { components: { Picker, Presets } },
  ) => (
    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <Presets />
      </Col>
      <Divider type="vertical" style={{ height: 'auto' }} />
      <Col flex="auto">
        <Picker />
      </Col>
    </Row>
  );

  return (
    <ColorPicker
      value={defaultValue}
      size="small"
      showText={false}
      styles={{ 
        popupOverlayInner: { width: 360 },
      }}
      presets={presets}
      panelRender={customPanelRender}
      placement='bottomLeft'
      onChange={
        (color) => {
          onChange(color)
        }
      }
    />
  );
};

export default ColorPickerComponent
