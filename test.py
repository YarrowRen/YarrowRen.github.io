import re

def clean_string(s):
    s = s.strip()  # 去除首尾空格
    # 删除两个中文之间的空格
    s = re.sub(r'(?<=[\u4e00-\u9fa5])\s+(?=[\u4e00-\u9fa5])', '', s)
    # 将多个空格合并为一个
    s = re.sub(r'\s+', ' ', s)
    return s

# 示例
text = "  你好   世界   hello   world  中 国   "
print(clean_string(text))  # 输出：你好世界 hello world 中国
