/** 校验项  */
export interface Rule {
  /** 错误提示 */
  message: string;
  /** 非空校验 */
  required?: boolean;
  /** 正则校验 */
  pattern?: RegExp | string;
}

/** 校验规则 */
export interface Rules {
  [key: string]: Rule[];
}

/**
 * 验证表单数据
 * @param form   表单数据
 * @param rules  校验规则
 */
export function validate(form: AnyObject, rules: Rules) {
  // 遍历规则
  for (let key in rules) {
    const ruleList = rules[key];
    for (let i = 0; i < ruleList.length; i++) {
      const rule = ruleList[i];
      // 处理验证规则，非空转换成正则写法，方便统一判断
      if (rule.required) rule.pattern = /\S+/;
      // 兼容用户书写字符串格式的正则
      const reg = new RegExp(rule.pattern as RegExp | string);
      // 数据验证， /\S+/.test(undefined) 为 true, 修复为空字符串
      if (!reg.test(form[key] || "")) {
        // 校验失败，提示用户
        uni.showToast({ icon: "none", title: rule.message });
        // 直接退出校验函数，返回校验失败结果
        return false;
      }
    }
  }
  // 校验通过
  return true;
}
