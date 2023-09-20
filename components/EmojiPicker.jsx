import PropTypes from "prop-types";
import React, { memo, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "../ThemeContext";
import { favoriteEmojis, routineEmojis } from "../lib/routineEmojis";
import getStyles from "../styles";
import getColors from "../styles/colors";
import HeaderButton from "./HeaderButton";

const Emoji = memo(({
  item, styles, colors, handleSelect,
}) => (
  <TouchableOpacity style={styles.emojiButton} onPress={() => handleSelect(item)}>
    <FontAwesome5 name={item} size={40} color={colors.text} />
  </TouchableOpacity>
));

Emoji.propTypes = {
  item         : PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  styles       : PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  colors       : PropTypes.object.isRequired,
  handleSelect : PropTypes.func.isRequired,
};

function EmojiPicker({ title, value, onSelect }) {
  const { isDarkMode } = useTheme();
  const styles         = getStyles({ isDarkMode });
  const colors         = getColors({ isDarkMode });

  const allEmojis = [...favoriteEmojis, ...routineEmojis];

  const [modalVisible, setModalVisible]     = useState(false);
  const [searchText, setSearchText]         = useState("");
  const [filteredEmojis, setFilteredEmojis] = useState(allEmojis);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = routineEmojis.filter((emoji) => emoji.includes(text));
    setFilteredEmojis(filtered);
  };

  const handleSelect = (emoji) => {
    onSelect(emoji);
    closeModal();
  };

  return (
    <View>
      <TouchableOpacity onPress={openModal}>
        <FontAwesome5 name={value || "sun"} size={60} color={colors.text} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <HeaderButton icon="times" text="Cancel" onPress={closeModal} />
              <Text style={[styles.text, styles.title]}>{title}</Text>
            </View>

            <FlatList
              data={filteredEmojis}
              renderItem={({ item }) => <Emoji item={item} styles={styles} colors={colors} handleSelect={handleSelect} />}
              getItemLayout={(data, index) => ({
                length : 60,
                offset : 60 * index,
                index,
              })}
              keyExtractor={(item) => item}
              numColumns={6}
              contentContainerStyle={styles.emojiList}
              ListHeaderComponent={(
                <View style={styles.modalHeader}>
                  <TextInput
                    style={[styles.text, styles.input, styles.emojiSearchInput]}
                    value={searchText}
                    onChangeText={handleSearch}
                    placeholder="Search emoji..."
                    placeholderTextColor={colors.mediumOpacity}
                    multiline
                  />
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

EmojiPicker.propTypes = {
  title    : PropTypes.string.isRequired,
  value    : PropTypes.string.isRequired,
  onSelect : PropTypes.func.isRequired,
};

export default EmojiPicker;
