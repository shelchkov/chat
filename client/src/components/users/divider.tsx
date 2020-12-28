import React, { ReactElement } from "react"
import styled from "styled-components"

import { theme } from "../../style-guide/theme"

const StyledDivider = styled.div`
	border-bottom: 1px solid ${theme.colors.greys[1]};
`

export const Divider = (): ReactElement => <StyledDivider />
