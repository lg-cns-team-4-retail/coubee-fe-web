import React from 'react';
import styled from 'styled-components';
import { Button, Input, Typography } from '../components/common';

const PreviewWrapper = styled.div`
  padding: 2rem;
  background-color: ${({ theme }) => theme.bg_page};
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
`;

const SectionTitle = styled(Typography)`
  margin-bottom: 1.5rem;
`;

const ComponentGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
`;

const ComponentPreview = () => {
  return (
    <PreviewWrapper>
      <Section>
        <SectionTitle variant="h2" as="h2">
          Typography
        </SectionTitle>
        <Typography variant="h1" as="h1">H1 Heading</Typography>
        <Typography variant="h2" as="h2">H2 Heading</Typography>
        <Typography variant="h3" as="h3">H3 Heading</Typography>
        <Typography variant="h4" as="h4">H4 Heading</Typography>
        <Typography variant="body">This is body text.</Typography>
        <Typography variant="caption">This is caption text.</Typography>
        <Typography variant="small">This is small text.</Typography>
        <Typography variant="body" weight="bold">Bold body text.</Typography>
      </Section>

      <Section>
        <SectionTitle variant="h2" as="h2">
          Buttons
        </SectionTitle>
        <ComponentGroup>
          <Button variant="primary" size="large">Large Primary</Button>
          <Button variant="primary" size="medium">Medium Primary</Button>
          <Button variant="primary" size="small">Small Primary</Button>
        </ComponentGroup>
        <ComponentGroup>
          <Button variant="secondary" size="large">Large Secondary</Button>
          <Button variant="secondary" size="medium">Medium Secondary</Button>
          <Button variant="secondary" size="small">Small Secondary</Button>
        </ComponentGroup>
        <ComponentGroup>
          <Button variant="tertiary" size="large">Large Tertiary</Button>
          <Button variant="tertiary" size="medium">Medium Tertiary</Button>
          <Button variant="tertiary" size="small">Small Tertiary</Button>
        </ComponentGroup>
        <ComponentGroup>
          <Button size="medium" disabled>Disabled Button</Button>
        </ComponentGroup>
      </Section>

      <Section>
        <SectionTitle variant="h2" as="h2">
          Inputs
        </SectionTitle>
        <ComponentGroup>
          <Input placeholder="Default Input" />
        </ComponentGroup>
        <ComponentGroup>
          <Input placeholder="Disabled Input" disabled />
        </ComponentGroup>
      </Section>
    </PreviewWrapper>
  );
};

export default ComponentPreview;
